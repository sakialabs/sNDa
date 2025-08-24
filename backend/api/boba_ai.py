"""
Boba AI Bot - Smart recommendations and notifications for sNDa platform
Boba (friendly AI companion) - small nudges that make a big difference
"""

from django.utils import timezone
from datetime import timedelta, datetime
from typing import List, Dict, Any
from .models import (
    Case, VolunteerProfile, Assignment, VolunteerStory, 
    ActivityLog, Badge, UserBadge, CommunityGoal, Notification
)
from users.models import CustomUser


class BobaAI:
    """AI-powered recommendation and notification system"""
    
    def __init__(self):
        self.recommendations = []
        self.notifications = []
    
    def get_volunteer_recommendations(self, user: CustomUser) -> List[Dict[str, Any]]:
        """Generate personalized recommendations for a volunteer"""
        recommendations = []
        profile, _ = VolunteerProfile.objects.get_or_create(user=user)
        
        # Case recommendations based on experience and availability
        case_recs = self._recommend_cases(user, profile)
        recommendations.extend(case_recs)
        
        # Badge opportunities
        badge_recs = self._recommend_badge_opportunities(user, profile)
        recommendations.extend(badge_recs)
        
        # Story sharing suggestions
        story_recs = self._recommend_story_sharing(user, profile)
        recommendations.extend(story_recs)
        
        # Streak maintenance
        streak_recs = self._recommend_streak_maintenance(user, profile)
        recommendations.extend(streak_recs)
        
        return recommendations[:5]  # Return top 5 recommendations
    
    def _recommend_cases(self, user: CustomUser, profile: VolunteerProfile) -> List[Dict[str, Any]]:
        """Recommend cases based on volunteer's skills and experience"""
        recommendations = []
        
        # Get available cases
        available_cases = Case.objects.filter(
            status__in=['NEW', 'TRIAGED'],
            assigned_volunteer__isnull=True
        ).order_by('-urgency_score', '-created_at')[:10]
        
        if not available_cases:
            return recommendations
        
        # Skill-based matching
        volunteer_skills = profile.skills.lower() if profile.skills else ""
        
        for case in available_cases:
            score = self._calculate_case_match_score(case, profile, volunteer_skills)
            
            if score > 0.3:  # Minimum match threshold
                recommendations.append({
                    'type': 'case_recommendation',
                    'priority': 'high' if case.urgency_score and case.urgency_score >= 7 else 'medium',
                    'title': f"Perfect match: {case.title}",
                    'description': f"This case matches your skills and has urgency score {case.urgency_score or 'N/A'}/10",
                    'action_url': f"/coordinator/cases/{case.id}",
                    'action_text': "View Case",
                    'icon': "🎯",
                    'match_score': score,
                    'case_id': str(case.id)
                })
        
        return sorted(recommendations, key=lambda x: x['match_score'], reverse=True)[:2]
    
    def _calculate_case_match_score(self, case: Case, profile: VolunteerProfile, skills: str) -> float:
        """Calculate how well a case matches a volunteer"""
        score = 0.0
        
        # Base score for availability
        if profile.availability:
            score += 0.2
        
        # Skill matching (simple keyword matching)
        case_text = f"{case.title} {case.description}".lower()
        if skills:
            skill_words = skills.split()
            matches = sum(1 for word in skill_words if word in case_text)
            score += min(0.4, matches * 0.1)
        
        # Experience level matching
        if profile.cases_completed == 0:
            # New volunteers get easier cases
            if not case.urgency_score or case.urgency_score <= 5:
                score += 0.3
        elif profile.cases_completed >= 10:
            # Experienced volunteers get challenging cases
            if case.urgency_score and case.urgency_score >= 7:
                score += 0.3
        
        # Urgency bonus for active volunteers
        if profile.current_streak >= 3 and case.urgency_score and case.urgency_score >= 8:
            score += 0.2
        
        return min(1.0, score)
    
    def _recommend_badge_opportunities(self, user: CustomUser, profile: VolunteerProfile) -> List[Dict[str, Any]]:
        """Recommend actions to earn specific badges"""
        recommendations = []
        
        # Check for badges close to earning
        if profile.cases_completed == 4:
            recommendations.append({
                'type': 'badge_opportunity',
                'priority': 'medium',
                'title': "One case away from 'Helper' badge! 🤝",
                'description': "Complete one more case to earn your Helper badge and 10 bonus points",
                'action_url': "/coordinator",
                'action_text': "Find Cases",
                'icon': "🏆"
            })
        
        if profile.current_streak == 6:
            recommendations.append({
                'type': 'badge_opportunity',
                'priority': 'high',
                'title': "Tomorrow: Unlock 'Lightning' badge! ⚡",
                'description': "Stay active tomorrow to earn your 7-day streak badge",
                'action_url': "/volunteer/dashboard",
                'action_text': "View Progress",
                'icon': "🔥"
            })
        
        # Story sharing opportunity
        story_count = VolunteerStory.objects.filter(author=user, status='PUBLISHED').count()
        if profile.cases_completed >= 1 and story_count == 0:
            recommendations.append({
                'type': 'badge_opportunity',
                'priority': 'medium',
                'title': "Share your first story! 📖",
                'description': "Earn the 'Storyteller' badge by sharing your volunteer experience",
                'action_url': "/volunteer/stories/new",
                'action_text': "Share Story",
                'icon': "✍️"
            })
        
        return recommendations
    
    def _recommend_story_sharing(self, user: CustomUser, profile: VolunteerProfile) -> List[Dict[str, Any]]:
        """Recommend story sharing based on completed cases"""
        recommendations = []
        
        # Check for completed cases without stories
        completed_assignments = Assignment.objects.filter(
            volunteer=user,
            status='COMPLETED',
            completed_at__gte=timezone.now() - timedelta(days=30)
        )
        
        stories_count = VolunteerStory.objects.filter(author=user).count()
        
        if completed_assignments.exists() and stories_count < completed_assignments.count():
            recent_case = completed_assignments.first()
            recommendations.append({
                'type': 'story_suggestion',
                'priority': 'medium',
                'title': f"Share your experience with {recent_case.case.title}",
                'description': "Your story could inspire other volunteers and help the community",
                'action_url': f"/volunteer/stories/new?case_id={recent_case.case.id}",
                'action_text': "Write Story",
                'icon': "📝"
            })
        
        return recommendations
    
    def _recommend_streak_maintenance(self, user: CustomUser, profile: VolunteerProfile) -> List[Dict[str, Any]]:
        """Recommend actions to maintain activity streak"""
        recommendations = []
        
        if not profile.last_activity:
            return recommendations
        
        days_since_activity = (timezone.now() - profile.last_activity).days
        
        if days_since_activity == 0 and profile.current_streak >= 3:
            # Encourage continued streak
            recommendations.append({
                'type': 'streak_maintenance',
                'priority': 'low',
                'title': f"Great job! {profile.current_streak} day streak! 🔥",
                'description': "Keep the momentum going - check for new assignments tomorrow",
                'action_url': "/volunteer/dashboard",
                'action_text': "View Dashboard",
                'icon': "⚡"
            })
        
        elif days_since_activity == 1 and profile.current_streak >= 7:
            # Streak at risk
            recommendations.append({
                'type': 'streak_maintenance',
                'priority': 'high',
                'title': f"Don't break your {profile.current_streak} day streak! 🚨",
                'description': "Take a quick action today to keep your amazing streak alive",
                'action_url': "/coordinator",
                'action_text': "Quick Action",
                'icon': "⏰"
            })
        
        return recommendations
    
    def generate_daily_notifications(self) -> List[Dict[str, Any]]:
        """Generate daily motivational notifications for all users"""
        notifications = []
        
        # Get volunteers with active streaks
        active_volunteers = VolunteerProfile.objects.filter(
            current_streak__gte=3,
            last_activity__gte=timezone.now() - timedelta(days=2)
        )
        
        for profile in active_volunteers:
            # Streak encouragement
            if profile.current_streak in [7, 14, 30, 100]:
                notifications.append({
                    'user_id': profile.user.id,
                    'type': 'streak_milestone',
                    'title': f"Amazing! {profile.current_streak} day streak! 🎉",
                    'message': f"You've been consistently helping for {profile.current_streak} days. The community appreciates you!",
                    'priority': 'medium'
                })
        
        # Community goal updates
        active_goals = CommunityGoal.objects.filter(
            is_active=True,
            progress_percentage__gte=80,
            progress_percentage__lt=100
        )
        
        for goal in active_goals:
            # Notify all volunteers about goals close to completion
            volunteers = VolunteerProfile.objects.filter(
                last_activity__gte=timezone.now() - timedelta(days=7)
            )
            
            for profile in volunteers:
                notifications.append({
                    'user_id': profile.user.id,
                    'type': 'community_goal',
                    'title': f"Almost there! {goal.icon} {goal.title}",
                    'message': f"We're at {goal.current_value}/{goal.target_value}. Help us reach our community goal!",
                    'priority': 'low'
                })
        
        return notifications
    
    def create_smart_community_goals(self) -> List[CommunityGoal]:
        """Create smart community goals based on current activity"""
        goals = []
        current_date = timezone.now().date()
        
        # Monthly case resolution goal
        monthly_cases = Case.objects.filter(
            status='RESOLVED',
            resolved_at__month=current_date.month,
            resolved_at__year=current_date.year
        ).count()
        
        # Set goal 20% higher than current pace
        target_cases = max(50, int(monthly_cases * 1.2))
        
        goal = CommunityGoal.objects.create(
            title="Monthly Case Resolution Challenge",
            description=f"Let's resolve {target_cases} cases this month together!",
            goal_type="CASES",
            target_value=target_cases,
            current_value=monthly_cases,
            start_date=current_date.replace(day=1),
            end_date=current_date.replace(day=28),  # End of month
            icon="🎯",
            is_active=True,
            is_featured=True
        )
        goals.append(goal)
        
        return goals
    
    def get_boba_greeting(self, user: CustomUser) -> str:
        """Get a personalized greeting from Boba"""
        profile, _ = VolunteerProfile.objects.get_or_create(user=user)
        
        greetings = [
            f"Hello {user.first_name}! 🌟 Ready to make a difference today?",
            f"Welcome back, {user.first_name}! Your {profile.current_streak} day streak is inspiring! 🔥",
            f"Hi {user.first_name}! The community has grown stronger with your {profile.cases_completed} completed cases! 💪",
            f"Greetings, {user.first_name}! I have some perfect case matches for you today! 🎯"
        ]
        
        # Choose greeting based on user activity
        if profile.current_streak >= 7:
            return greetings[1]
        elif profile.cases_completed >= 5:
            return greetings[2]
        elif profile.cases_completed >= 1:
            return greetings[3]
        else:
            return greetings[0]


# Singleton instance
boba = BobaAI()
