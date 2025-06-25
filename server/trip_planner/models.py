import uuid
from django.db import models


class Trip(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    current_location = models.JSONField()
    pickup_location = models.JSONField()
    dropoff_location = models.JSONField()
    current_cycle_used_hours = models.IntegerField()
    total_distance_km = models.FloatField(null=True, blank=True)
    estimated_days = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"Trip {self.id}"


class RouteSegment(models.Model):
    SEGMENT_TYPES = [
        ('drive', 'Drive'),
        ('pickup', 'Pickup'),
        ('dropoff', 'Dropoff'),
        ('refuel', 'Refuel'),
        ('rest', 'Rest'),
        ('break', 'Break'),
    ]

    trip = models.ForeignKey(Trip, related_name='segments', on_delete=models.CASCADE)
    type = models.CharField(max_length=20, choices=SEGMENT_TYPES)
    start_location = models.JSONField(null=True, blank=True)
    end_location = models.JSONField(null=True, blank=True)
    duration_minutes = models.IntegerField(null=True, blank=True)
    distance_km = models.FloatField(null=True, blank=True)
    sequence_order = models.IntegerField(default=0)

    class Meta:
        ordering = ['sequence_order']

    def __str__(self):
        return f"{self.trip.id} - {self.type} - {self.sequence_order}"


class LogSheet(models.Model):
    DUTY_STATUS_CHOICES = [
        ('off-duty', 'Off Duty'),
        ('on-duty', 'On Duty'),
        ('driving', 'Driving'),
        ('break', 'Break'),
        ('rest', 'Rest'),
        ('sleeper', 'Sleeper'),
    ]

    trip = models.ForeignKey(Trip, related_name='logs', on_delete=models.CASCADE)
    day_number = models.IntegerField()
    graph_points = models.JSONField()
    summary = models.JSONField()

    class Meta:
        unique_together = ['trip', 'day_number']
        ordering = ['day_number']

    def __str__(self):
        return f"{self.trip.id} - Day {self.day_number}"
