import random
import uuid
from datetime import timedelta, date

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone

from api.models import (
    Person,
    Case,
    Assignment,
    VolunteerProfile,
    VolunteerStory,
    StoryMedia,
    StoryLike,
    StoryComment,
    Badge,
    UserBadge,
    CommunityGoal,
    EmailSchedule,
    EmailAnalytics,
)


FIRST_NAMES = [
    "Ahmed", "Mariam", "Omar", "Layla", "Hassan", "Noura", "Kareem", "Aisha",
]
LAST_NAMES = [
    "Ali", "Hassan", "Youssef", "Mahmoud", "Ibrahim", "Fahmy", "Saleh", "Farouk",
]
CASE_TITLES = [
    "Emergency Medical Assistance",
    "Shelter Support Needed",
    "Food Aid for Family",
    "School Supplies for Children",
    "Job Placement Support",
    "Legal Aid Consultation",
]
STORY_SNIPPETS = [
    "Today I met with the family and assessed urgent needs.",
    "We coordinated with local partners to secure supplies.",
    "Volunteer team made a great progress this week!",
    "A touching milestone: the first day back to school.",
]
BADGES = [
    ("First Case", "Completed the first case", "🥇", "MILESTONE", 50),
    ("Community Helper", "5 helpful comments", "🤝", "COMMUNITY", 30),
    ("Storyteller", "Published a story", "📝", "MILESTONE", 20),
]


class Command(BaseCommand):
    help = "Seed demo data for prototype. Safe to run multiple times."

    def add_arguments(self, parser):
        parser.add_argument("--users", type=int, default=5, help="Number of volunteer users to create")
        parser.add_argument("--cases", type=int, default=10, help="Number of cases to create")
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Dangerous in production: deletes demo data we previously created",
        )

    def handle(self, *args, **options):
        User = get_user_model()
        users_n = options["users"]
        cases_n = options["cases"]
        do_reset = options["reset"]

        self.stdout.write(self.style.MIGRATE_HEADING("Seeding demo data..."))

        if do_reset:
            self._reset_demo_data(User)

        # Ensure a coordinator account exists
        coordinator, _ = User.objects.get_or_create(
            username="coordinator",
            defaults={
                "first_name": "Team",
                "last_name": "Coordinator",
                "email": "coordinator@example.com",
                "is_staff": True,
                "is_superuser": True,
            },
        )
        coordinator.set_password("ChangeMe!123")
        coordinator.save()

        # Create volunteer users and profiles
        volunteers = []
        for i in range(users_n):
            fn = random.choice(FIRST_NAMES)
            ln = random.choice(LAST_NAMES)
            username = f"vol{i+1}"
            user, _ = User.objects.get_or_create(
                username=username,
                defaults={
                    "first_name": fn,
                    "last_name": ln,
                    "email": f"{username}@example.com",
                },
            )
            # Set a known password for demo
            user.set_password("ChangeMe!123")
            user.save()

            VolunteerProfile.objects.get_or_create(
                user=user,
                defaults={
                    "phone_number": f"+2010{random.randint(1000000, 9999999)}",
                    "skills": "communication, logistics",
                    "availability": "weekends",
                    "is_onboarded": True,
                    "cases_completed": random.randint(0, 5),
                    "current_streak": random.randint(0, 7),
                    "longest_streak": random.randint(3, 14),
                    "last_activity": timezone.now() - timedelta(days=random.randint(0, 5)),
                    "total_points": random.randint(50, 300),
                },
            )
            volunteers.append(user)

        # Create persons
        persons = []
        for i in range(cases_n):
            fn = random.choice(FIRST_NAMES)
            ln = random.choice(LAST_NAMES)
            p, _ = Person.objects.get_or_create(
                first_name=fn,
                last_name=ln,
                defaults={
                    "gender": random.choice(["male", "female", "other"]),
                    "location_details": random.choice(["Cairo", "Giza", "Alexandria", "Aswan"]),
                    "date_of_birth": date(1990 + random.randint(0, 20), random.randint(1, 12), random.randint(1, 28)),
                },
            )
            persons.append(p)

        # Create cases linking to persons and volunteers
        cases = []
        for i in range(cases_n):
            title = random.choice(CASE_TITLES)
            subject = random.choice(persons)
            case, _ = Case.objects.get_or_create(
                title=f"{title} #{i+1}",
                primary_subject=subject,
                defaults={
                    "description": random.choice(STORY_SNIPPETS),
                    "status": random.choice(["NEW", "IN_PROGRESS", "RESOLVED"]),
                    "urgency_score": random.randint(1, 10),
                    "is_public": random.choice([True, False]),
                    "success_story": None,
                },
            )
            # Associate 1-3 extra people
            for extra in random.sample(persons, k=min(3, max(1, random.randint(1, 3)))):
                case.associated_people.add(extra)

            # Optionally assign a volunteer
            if volunteers and random.choice([True, False]):
                case.assigned_volunteer = random.choice(volunteers)
                case.save()

            cases.append(case)

        # Create assignments for some cases
        for case in cases:
            if not volunteers:
                break
            if random.choice([True, False]):
                volunteer = random.choice(volunteers)
                Assignment.objects.get_or_create(
                    case=case,
                    volunteer=volunteer,
                    coordinator=coordinator,
                    defaults={
                        "status": random.choice([
                            "PENDING",
                            "ACCEPTED",
                            "IN_PROGRESS",
                            "COMPLETED",
                        ]),
                        "assignment_note": "Please coordinate with local partner and update.",
                        "estimated_hours": random.randint(1, 8),
                        "created_at": timezone.now() - timedelta(days=random.randint(0, 10)),
                    },
                )

        # Ensure some badges exist
        for name, desc, icon, cat, pts in BADGES:
            Badge.objects.get_or_create(
                name=name,
                defaults={
                    "description": desc,
                    "icon": icon,
                    "category": cat,
                    "points_value": pts,
                    "required_cases": 1 if name == "First Case" else None,
                },
            )

        # Award a few badges
        all_badges = list(Badge.objects.all())
        for v in volunteers:
            if all_badges and random.choice([True, False]):
                b = random.choice(all_badges)
                UserBadge.objects.get_or_create(user=v, badge=b)

        # Community goals
        CommunityGoal.objects.get_or_create(
            title="Resolve 25 Cases this Month",
            goal_type="CASES",
            defaults={
                "description": "Let’s rally to resolve cases together!",
                "target_value": 25,
                "current_value": random.randint(5, 20),
                "start_date": date.today() - timedelta(days=7),
                "end_date": date.today() + timedelta(days=21),
                "is_active": True,
                "is_featured": True,
                "icon": "🎯",
            },
        )

        # Stories + minimal engagement
        for v in volunteers:
            if random.choice([True, False]):
                related_case = random.choice(cases) if cases else None
                story, _ = VolunteerStory.objects.get_or_create(
                    title=f"Volunteer update by {v.first_name or v.username}",
                    author=v,
                    defaults={
                        "content": random.choice(STORY_SNIPPETS),
                        "related_case": related_case,
                        "story_type": random.choice(["EXPERIENCE", "CASE_UPDATE", "REFLECTION", "MILESTONE"]),
                        "status": random.choice(["DRAFT", "PUBLISHED"]),
                        "published_at": timezone.now() if random.choice([True, False]) else None,
                    },
                )
                # Some engagement counts
                story.likes_count = random.randint(0, 10)
                story.comments_count = random.randint(0, 5)
                story.shares_count = random.randint(0, 3)
                story.save()

        # Onboarding email schedules for a couple of users
        now = timezone.now()
        for v in volunteers[:2]:
            for i, email_type in enumerate(["onboarding_day0", "onboarding_day3", "onboarding_day7"]):
                EmailSchedule.objects.get_or_create(
                    user=v,
                    email_type=email_type,
                    scheduled_for=now + timedelta(days=i * 3),
                    defaults={
                        "is_volunteer": True,
                        "sent": False,
                    },
                )

        self.stdout.write(self.style.SUCCESS("Demo data seeded successfully."))

    def _reset_demo_data(self, User):
        # Only delete objects that are clearly demo-safe
        Assignment.objects.all().delete()
        VolunteerStory.objects.all().delete()
        StoryMedia.objects.all().delete()
        StoryLike.objects.all().delete()
        StoryComment.objects.all().delete()
        UserBadge.objects.all().delete()
        EmailAnalytics.objects.all().delete()
        EmailSchedule.objects.all().delete()
        Case.objects.all().delete()
        Person.objects.all().delete()
        CommunityGoal.objects.all().delete()
        Badge.objects.all().delete()
        # Keep users, but remove demo volunteers (vol1..volN and coordinator)
        User.objects.filter(username__in=["coordinator"]).delete()
        User.objects.filter(username__startswith="vol").delete()
        self.stdout.write(self.style.WARNING("Previous demo data removed."))
