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

# Check if we have any trips
trips = Trip.objects.all()
print(f"Total trips: {trips.count()}")

if trips.exists():
    trip = trips.first()
    print(f"Trip ID: {trip.id}")
    
    # Check log sheets
    logs = LogSheet.objects.filter(trip=trip)
    print(f"Total log sheets for trip: {logs.count()}")
    
    for log in logs:
        print(f"Day {log.day_number}: {len(log.graph_points)} graph points")
        for point in log.graph_points:
            print(f"  {point}")
else:
    print("No trips found. Creating a test trip...")
    
    # Create a test trip
    trip_data = {
        'current_location': {'lat': 40.7128, 'lng': -74.0060},
        'pickup_location': {'lat': 41.8781, 'lng': -87.6298},
        'dropoff_location': {'lat': 34.0522, 'lng': -118.2437},
        'current_cycle_used_hours': 0
    }
    
    service = TripPlanningService()
    trip = service.plan_trip(trip_data)
    
    print(f"Created trip: {trip.id}")
    
    # Check log sheets
    logs = LogSheet.objects.filter(trip=trip)
    print(f"Generated log sheets: {logs.count()}")
    
    for log in logs:
        print(f"Day {log.day_number}: {len(log.graph_points)} graph points")
        for point in log.graph_points:
            print(f"  {point}")