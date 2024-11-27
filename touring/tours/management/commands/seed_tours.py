import json

from django.core.management.base import BaseCommand
from django.conf import settings
from tours.models import Tour, StartDate

FILE_PATH = settings.BASE_DIR.parent / "data" / "tours-simple.json"


class Command(BaseCommand):
    help = "Seed the Tour and StartDate models with data from a json file"

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("=> 🌱Seeding tours data..."))

        if not FILE_PATH.exists():
            self.stderr.write(self.style.ERROR("=> File path does not exist."))
            return

        with open(FILE_PATH) as file:
            data = json.load(file)

        for item in data:
            tour, created = Tour.objects.update_or_create(
                name=item["name"],
                defaults={
                    "duration": item["duration"],
                    "max_group_size": item["max_group_size"],
                    "difficulty": item["difficulty"],
                    "rating_avg": item["rating_avg"],
                    "rating_qty": item["rating_qty"],
                    "price": item["price"] * 100,  # Store in cents
                    "summary": item["summary"],
                    "description": item["description"],
                },
            )

            if created:
                self.stdout.write(self.style.SUCCESS(f"✅Created tour: {tour.name}"))
            else:
                self.stdout.write(self.style.WARNING(f"⚠️Updated tour: {tour.name}"))

            # Create the start dates and related them to the tour
            for date in item["start_dates"]:
                StartDate.objects.create(tour=tour, date=date)

            self.stdout.write(
                self.style.SUCCESS(f"Added start dats for tour: {tour.name}")
            )

        self.stdout.write(self.style.SUCCESS("Tours seeded successfully!"))
