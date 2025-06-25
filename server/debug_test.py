import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')
django.setup()

from trip_planner.services import TripPlanningService

# Test data
test_data = {
    "current_location": {"lat": 40.7128, "lng": -74.0060},
    "pickup_location": {"lat": 41.8781, "lng": -87.6298},
    "dropoff_location": {"lat": 34.0522, "lng": -118.2437},
    "current_cycle_used_hours": 20
}

try:
    service = TripPlanningService()
    trip = service.plan_trip(test_data)
    print(f"Trip created successfully: {trip.id}")
    print(f"Total distance: {trip.total_distance_km}")
    print(f"Estimated days: {trip.estimated_days}")
    print(f"Segments count: {trip.segments.count()}")
    print(f"Logs count: {trip.logs.count()}")
    
    # Print segments
    for segment in trip.segments.all():
        print(f"Segment: {segment.type} - {segment.duration_minutes} minutes")
        
except Exception as e:
    import traceback
    print(f"Error: {e}")
    print(traceback.format_exc())