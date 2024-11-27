# Generated by Django 5.1.3 on 2024-11-26 17:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("tours", "0002_alter_tour_duration_alter_tour_max_group_size_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="tour",
            name="difficulty",
            field=models.CharField(
                choices=[
                    ("easy", "Easy"),
                    ("moderate", "Moderate"),
                    ("difficult", "Difficult"),
                ],
                max_length=10,
            ),
        ),
    ]
