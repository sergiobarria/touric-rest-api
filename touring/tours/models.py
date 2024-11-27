import uuid

from django.db import models
from django_extensions.db.fields import AutoSlugField
from auditlog.registry import auditlog
from django.core.validators import MinValueValidator, MaxValueValidator


class Tour(models.Model):
    """Describe the Tour model"""

    class Difficulty(models.TextChoices):
        EASY = "easy", "Easy"
        MODERATE = "moderate", "Moderate"
        DIFFICULT = "difficult", "Difficult"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    name = models.CharField(max_length=100)
    slug = AutoSlugField(populate_from="name", unique=True)
    duration = models.PositiveIntegerField(
        validators=[
            MinValueValidator(1, message="Duration must be at least 1 day."),
            MaxValueValidator(30, message="Duration must be at least 30 days."),
        ]
    )
    max_group_size = models.PositiveIntegerField(
        validators=[
            MinValueValidator(1, message="Max group size must be at least 1 person."),
            MaxValueValidator(100, message="Max group size must be max 100 people."),
        ]
    )
    difficulty = models.CharField(max_length=10, choices=Difficulty.choices)
    rating_avg = models.DecimalField(
        max_digits=3,
        decimal_places=1,
        default=0.0,
        validators=[
            MinValueValidator(0.0, message="Rating must be at least 0."),
            MaxValueValidator(5.0, message="Rating must be max 5."),
        ],
    )
    rating_qty = models.PositiveIntegerField(default=0)
    price = models.PositiveIntegerField()
    price_discount_percent = models.PositiveIntegerField(
        default=0,
        validators=[
            MinValueValidator(
                0.0, message="Price discount percentage must be at least 0."
            ),
            MaxValueValidator(
                100.0, message="Price discount percentage must be max 100 people."
            ),
        ],
    )
    summary = models.TextField()
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name


class StartDate(models.Model):
    """Describe the Start Date model"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    date = models.DateTimeField()
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, related_name="start_dates")

    def __str__(self):
        return f"{self.tour.name} - {self.date}"


# Register auditlog tables
auditlog.register(Tour)
auditlog.register(StartDate)
