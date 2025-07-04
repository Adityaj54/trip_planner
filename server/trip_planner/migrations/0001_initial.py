# Generated by Django 5.2.3 on 2025-06-23 05:53

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Trip',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('current_location', models.JSONField()),
                ('pickup_location', models.JSONField()),
                ('dropoff_location', models.JSONField()),
                ('current_cycle_used_hours', models.IntegerField()),
                ('total_distance_km', models.FloatField(blank=True, null=True)),
                ('estimated_days', models.IntegerField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='RouteSegment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('drive', 'Drive'), ('pickup', 'Pickup'), ('dropoff', 'Dropoff'), ('refuel', 'Refuel'), ('rest', 'Rest'), ('break', 'Break')], max_length=20)),
                ('start_location', models.JSONField(blank=True, null=True)),
                ('end_location', models.JSONField(blank=True, null=True)),
                ('duration_minutes', models.IntegerField(blank=True, null=True)),
                ('distance_km', models.FloatField(blank=True, null=True)),
                ('sequence_order', models.IntegerField(default=0)),
                ('trip', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='segments', to='trip_planner.trip')),
            ],
            options={
                'ordering': ['sequence_order'],
            },
        ),
        migrations.CreateModel(
            name='LogSheet',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('day_number', models.IntegerField()),
                ('graph_points', models.JSONField()),
                ('summary', models.JSONField()),
                ('trip', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='logs', to='trip_planner.trip')),
            ],
            options={
                'ordering': ['day_number'],
                'unique_together': {('trip', 'day_number')},
            },
        ),
    ]
