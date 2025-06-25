#!/usr/bin/env python3

import os
import sys
import django

# Add the project path
sys.path.append('/Users/adityaaralimara/IdeaProjects/lorry/server')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')

# Setup Django
django.setup()

from trip_planner.models import Trip, LogSheet
from trip_planner.services import TripPlanningService

# Get all trips and regenerate their logs
trips = Trip.objects.all()
print(f"Regenerating logs for {trips.count()} trips...")

service = TripPlanningService()

for trip in trips:
    print(f"Processing trip {trip.id}")
    
    # Delete existing log sheets
    LogSheet.objects.filter(trip=trip).delete()
    
    # Regenerate log sheets with new format
    service._generate_log_sheets(trip)
    
    # Check the new logs
    logs = LogSheet.objects.filter(trip=trip)
    print(f"  Generated {logs.count()} log sheets")
    
    # Show first log's graph points to verify format
    if logs.exists():
        first_log = logs.first()
        print(f"  Sample graph points from day {first_log.day_number}:")
        for point in first_log.graph_points[:3]:  # Show first 3 points
            print(f"    {point}")

print("Done!")