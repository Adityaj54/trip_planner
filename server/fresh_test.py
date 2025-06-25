import os
import django
import json

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')
django.setup()

from trip_planner.models import Trip, LogSheet
from trip_planner.services import TripPlanningService

# Clean up old data
Trip.objects.all().delete()

# Test data - matches the example from Log_Sheet_Generation.md
test_data = {
    "current_location": {"lat": 40.7128, "lng": -74.0060},
    "pickup_location": {"lat": 41.8781, "lng": -87.6298},
    "dropoff_location": {"lat": 34.0522, "lng": -118.2437},
    "current_cycle_used_hours": 0  # Start fresh
}

try:
    service = TripPlanningService()
    trip = service.plan_trip(test_data)
    print(f"Trip created successfully: {trip.id}")
    print(f"Total distance: {trip.total_distance_km:.2f} km")
    print(f"Estimated days: {trip.estimated_days}")
    print(f"Segments count: {trip.segments.count()}")
    print(f"Logs count: {trip.logs.count()}")
    print()
    
    # Print segments
    print("=== Route Segments ===")
    for i, segment in enumerate(trip.segments.all()):
        print(f"{i+1}. {segment.type} - {segment.duration_minutes} minutes")
    print()
    
    # Print all log sheets
    print("=== Log Sheets ===")
    for log in trip.logs.all():
        print(f"Day {log.day_number}:")
        print(f"  Summary: driving={log.summary['driving_hours']}h, on_duty={log.summary['on_duty_hours']}h, rest={log.summary['rest_hours']}h")
        print(f"  Graph Points:")
        for point in log.graph_points:
            print(f"    {point['time']} - {point['status']}")
        print()
        
except Exception as e:
    import traceback
    print(f"Error: {e}")
    print(traceback.format_exc())