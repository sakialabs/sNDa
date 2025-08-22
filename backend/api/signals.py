from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta, date
from .models import (
    Assignment, VolunteerProfile, VolunteerStory, Badge, UserBadge, 
    CommunityGoal, ActivityLog, EmailSchedule
)
from .email_system import email_service
from .tasks import (
    onboarding_email_sequence_task,
    send_assignment_notification_task,
    send_story_published_notification_task
)


@receiver(post_save, sender=User)
def send_onboarding_email(sender, instance, created, **kwargs):
    """Schedule onboarding email sequence using Celery"""
    if created and hasattr(instance, 'volunteerprofile'):
        onboarding_email_sequence_task.delay(instance.id, is_volunteer=True)
    elif created:
        onboarding_email_sequence_task.delay(instance.id, is_volunteer=False)


@receiver(post_save, sender=Assignment)
def assignment_created(sender, instance, created, **kwargs):
    """Handle new assignment creation"""
    if created:
        # Log activity
        ActivityLog.objects.create(
            user=instance.volunteer,
            activity_type='assignment_accepted',
            description=f'Accepted assignment for case: {instance.case.title}',
            points_earned=5,
            metadata={'case_id': str(instance.case.id)}
        )
        
        # Send assignment notification email using Celery
        send_assignment_notification_task.delay(instance.id)
        
        # Update volunteer profile
        profile, created = VolunteerProfile.objects.get_or_create(user=instance.volunteer)
        profile.cases_accepted += 1
        profile.last_activity = timezone.now()
        profile.save()


@receiver(post_save, sender=Assignment)
def handle_assignment_completion(sender, instance, created, **kwargs):
    """Award points and badges when assignments are completed"""
    if instance.status == 'COMPLETED' and instance.completed_at:
        volunteer = instance.volunteer
        
        # Create activity log
        ActivityLog.objects.create(
            user=volunteer,
            activity_type='CASE_COMPLETED',
            points_earned=50,  # Base points for completing a case
            related_case=instance.case,
            related_assignment=instance
        )
        
        # Update volunteer profile
        profile, created = VolunteerProfile.objects.get_or_create(user=volunteer)
        profile.cases_completed += 1
        profile.last_activity = timezone.now()
        profile.total_points += 50
        
        # Update streak
        update_user_streak(volunteer)
        
        # Check for milestone badges
        check_milestone_badges(volunteer, profile.cases_completed)
        
        # Update community goals
        update_community_goal('CASES', 1)
        
        profile.save()


@receiver(post_save, sender=VolunteerStory)
def story_published(sender, instance, created, **kwargs):
    """Handle story publication"""
    old_status = VolunteerStory.objects.get(id=instance.id).status if not created else None
    if instance.status == 'PUBLISHED' and instance.published_at and old_status != 'PUBLISHED':
        # Award story badge if this is their first published story
        profile, _ = VolunteerProfile.objects.get_or_create(user=instance.author)
        
        # Check for story milestones
        story_count = VolunteerStory.objects.filter(
            author=instance.author, 
            status='PUBLISHED'
        ).count()
        
        # Award badges for story milestones
        story_badges = {
            1: 'first-story',
            5: 'storyteller',
            10: 'story-champion'
        }
        
        if story_count in story_badges:
            badge_name = story_badges[story_count]
            try:
                badge = Badge.objects.get(name__icontains=badge_name.replace('-', ' '))
                UserBadge.objects.get_or_create(
                    user=instance.author,
                    badge=badge,
                    defaults={'earned_for_story': instance}
                )
            except Badge.DoesNotExist:
                pass
        
        # Log activity
        ActivityLog.objects.create(
            user=instance.author,
            activity_type='story_published',
            description=f'Published story: {instance.title}',
            points_earned=15,
            metadata={
                'story_id': str(instance.id),
                'story_count': story_count
            }
        )
        
        # Update community goals
        update_community_goal('STORIES', 1)
        
        # Send story published notification using Celery
        send_story_published_notification_task.delay(instance.id)
        
        profile.save()


def update_user_streak(user):
    """Calculate and update user's activity streak"""
    profile, created = VolunteerProfile.objects.get_or_create(user=user)
    
    # Get user's recent activities
    today = timezone.now().date()
    yesterday = today - timedelta(days=1)
    
    # Check if user was active yesterday
    was_active_yesterday = ActivityLog.objects.filter(
        user=user,
        created_at__date=yesterday,
        activity_type__in=['CASE_COMPLETED', 'STORY_PUBLISHED', 'ASSIGNMENT_ACCEPTED']
    ).exists()
    
    # Check if user is active today
    is_active_today = ActivityLog.objects.filter(
        user=user,
        created_at__date=today,
        activity_type__in=['CASE_COMPLETED', 'STORY_PUBLISHED', 'ASSIGNMENT_ACCEPTED']
    ).exists()
    
    if is_active_today:
        if was_active_yesterday or profile.current_streak == 0:
            # Continue or start streak
            profile.current_streak += 1
        else:
            # Reset streak if there was a gap
            profile.current_streak = 1
        
        # Update longest streak
        if profile.current_streak > profile.longest_streak:
            profile.longest_streak = profile.current_streak
        
        # Check for streak badges
        check_streak_badges(user, profile.current_streak)
    
    profile.save()


def check_milestone_badges(user, cases_completed):
    """Check and award milestone badges based on cases completed"""
    milestone_badges = [
        (1, "first-case", "🎉", "First Case", "Completed your first case!"),
        (5, "helper", "🤝", "Helper", "Completed 5 cases"),
        (10, "dedicated", "⭐", "Dedicated", "Completed 10 cases"),
        (25, "champion", "🏆", "Champion", "Completed 25 cases"),
        (50, "hero", "🦸", "Hero", "Completed 50 cases"),
        (100, "legend", "👑", "Legend", "Completed 100 cases"),
    ]
    
    for required_cases, badge_key, icon, name, description in milestone_badges:
        if cases_completed >= required_cases:
            badge, created = Badge.objects.get_or_create(
                name=name,
                defaults={
                    'description': description,
                    'icon': icon,
                    'category': 'MILESTONE',
                    'required_cases': required_cases,
                    'points_value': required_cases * 2,
                    'color': 'gold' if required_cases >= 50 else 'blue'
                }
            )
            
            # Award badge if not already earned
            user_badge, badge_created = UserBadge.objects.get_or_create(
                user=user,
                badge=badge
            )
            
            if badge_created:
                # Add bonus points for earning badge
                profile = user.volunteer_profile
                profile.total_points += badge.points_value
                profile.save()


def check_streak_badges(user, current_streak):
    """Check and award streak badges"""
    streak_badges = [
        (3, "streak-3", "🔥", "On Fire", "3-day streak!"),
        (7, "streak-7", "⚡", "Lightning", "7-day streak!"),
        (14, "streak-14", "💫", "Stellar", "14-day streak!"),
        (30, "streak-30", "🌟", "Superstar", "30-day streak!"),
        (100, "streak-100", "🚀", "Unstoppable", "100-day streak!"),
    ]
    
    for required_streak, badge_key, icon, name, description in streak_badges:
        if current_streak >= required_streak:
            badge, created = Badge.objects.get_or_create(
                name=name,
                defaults={
                    'description': description,
                    'icon': icon,
                    'category': 'STREAK',
                    'required_streak': required_streak,
                    'points_value': required_streak,
                    'color': 'orange'
                }
            )
            
            UserBadge.objects.get_or_create(user=user, badge=badge)


def check_story_badges(user, story_count):
    """Check and award story-related badges"""
    story_badges = [
        (1, "storyteller", "📖", "Storyteller", "Shared your first story!"),
        (5, "narrator", "📚", "Narrator", "Shared 5 stories"),
        (10, "chronicler", "✍️", "Chronicler", "Shared 10 stories"),
        (25, "author", "📝", "Author", "Shared 25 stories"),
    ]
    
    for required_stories, badge_key, icon, name, description in story_badges:
        if story_count >= required_stories:
            badge, created = Badge.objects.get_or_create(
                name=name,
                defaults={
                    'description': description,
                    'icon': icon,
                    'category': 'COMMUNITY',
                    'required_stories': required_stories,
                    'points_value': required_stories * 5,
                    'color': 'purple'
                }
            )
            
            UserBadge.objects.get_or_create(user=user, badge=badge)


def update_community_goal(goal_type, increment=1):
    """Update active community goals"""
    active_goals = CommunityGoal.objects.filter(
        goal_type=goal_type,
        is_active=True,
        end_date__gte=timezone.now().date()
    )
    
    for goal in active_goals:
        goal.current_value += increment
        goal.save()


# Initialize default badges when the app starts
def create_default_badges():
    """Create default badge set if none exist"""
    if not Badge.objects.exists():
        default_badges = [
            # Milestone badges
            ("🎉", "First Case", "Completed your first case!", "MILESTONE", 1, None, None, "gold"),
            ("🤝", "Helper", "Completed 5 cases", "MILESTONE", 5, None, None, "blue"),
            ("⭐", "Dedicated", "Completed 10 cases", "MILESTONE", 10, None, None, "blue"),
            ("🏆", "Champion", "Completed 25 cases", "MILESTONE", 25, None, None, "gold"),
            ("🦸", "Hero", "Completed 50 cases", "MILESTONE", 50, None, None, "gold"),
            ("👑", "Legend", "Completed 100 cases", "MILESTONE", 100, None, None, "gold"),
            
            # Streak badges
            ("🔥", "On Fire", "3-day activity streak!", "STREAK", None, 3, None, "orange"),
            ("⚡", "Lightning", "7-day activity streak!", "STREAK", None, 7, None, "orange"),
            ("💫", "Stellar", "14-day activity streak!", "STREAK", None, 14, None, "orange"),
            ("🌟", "Superstar", "30-day activity streak!", "STREAK", None, 30, None, "orange"),
            ("🚀", "Unstoppable", "100-day activity streak!", "STREAK", None, 100, None, "orange"),
            
            # Story badges
            ("📖", "Storyteller", "Shared your first story!", "COMMUNITY", None, None, 1, "purple"),
            ("📚", "Narrator", "Shared 5 stories", "COMMUNITY", None, None, 5, "purple"),
            ("✍️", "Chronicler", "Shared 10 stories", "COMMUNITY", None, None, 10, "purple"),
            ("📝", "Author", "Shared 25 stories", "COMMUNITY", None, None, 25, "purple"),
            
            # Special badges
            ("🌟", "Early Adopter", "Joined during beta!", "SPECIAL", None, None, None, "rainbow"),
            ("💝", "Generous Heart", "Made your first donation", "SPECIAL", None, None, None, "pink"),
        ]
        
        for icon, name, description, category, req_cases, req_streak, req_stories, color in default_badges:
            Badge.objects.create(
                icon=icon,
                name=name,
                description=description,
                category=category,
                required_cases=req_cases,
                required_streak=req_streak,
                required_stories=req_stories,
                points_value=10,
                color=color
            )
