# Generated data migration for default badges

from django.db import migrations


def create_default_badges(apps, schema_editor):
    """Create default badge set if none exist"""
    Badge = apps.get_model('api', 'Badge')
    
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
            
            # Community badges
            ("💬", "Communicator", "Posted 10 community updates", "COMMUNITY", None, None, 10, "green"),
            ("📢", "Voice", "Posted 25 community updates", "COMMUNITY", None, None, 25, "green"),
            ("🎤", "Speaker", "Posted 50 community updates", "COMMUNITY", None, None, 50, "green"),
            ("📣", "Influencer", "Posted 100 community updates", "COMMUNITY", None, None, 100, "green"),
            
            # Special badges
            ("🎯", "Focused", "Completed 3 cases in one day", "SPECIAL", None, None, None, "purple"),
            ("⚡", "Speed Demon", "Completed case in under 1 hour", "SPECIAL", None, None, None, "purple"),
            ("🌅", "Early Bird", "Completed case before 8 AM", "SPECIAL", None, None, None, "purple"),
            ("🌙", "Night Owl", "Completed case after 10 PM", "SPECIAL", None, None, None, "purple"),
            ("🎊", "Weekend Warrior", "Completed case on weekend", "SPECIAL", None, None, None, "purple"),
        ]
        
        for emoji, name, description, badge_type, cases_required, streak_required, posts_required, color in default_badges:
            Badge.objects.create(
                emoji=emoji,
                name=name,
                description=description,
                badge_type=badge_type,
                cases_required=cases_required,
                streak_required=streak_required,
                posts_required=posts_required,
                color=color
            )


def reverse_default_badges(apps, schema_editor):
    """Remove default badges"""
    Badge = apps.get_model('api', 'Badge')
    Badge.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_initial'),
    ]

    operations = [
        migrations.RunPython(create_default_badges, reverse_default_badges),
    ]