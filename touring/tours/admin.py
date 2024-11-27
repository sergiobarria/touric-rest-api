from django.contrib import admin
from .models import Tour, StartDate
import locale


@admin.register(Tour)
class TourAdmin(admin.ModelAdmin):
    """Admin configuration for the Tour model."""

    list_display = (
        "name",
        "slug",
        "difficulty",
        "rating_avg",
        "price_in_dollars",
        "created_at",
    )
    list_display_links = ("name", "slug")
    list_filter = (
        "difficulty",
        "created_at",
        "updated_at",
        "rating_avg",
        "price",
    )
    search_fields = ("name", "slug", "summary", "description")
    ordering = ("-created_at", "name")
    list_editable = ()
    readonly_fields = ("created_at", "updated_at")

    def price_in_dollars(self, obj):
        locale.setlocale(locale.LC_ALL, "en_US.UTF-8")
        return locale.currency(obj.price / 100, grouping=True)

    price_in_dollars.short_description = "Price (USD)"


@admin.register(StartDate)
class StartDateAdmin(admin.ModelAdmin):
    """Admin configuration for the StartDate model."""

    list_display = ("tour", "date")
    list_display_links = ("tour",)
    list_filter = ("tour", "date")
    search_fields = ("tour__name", "date")
    ordering = ("-date",)
