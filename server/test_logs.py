import os
import django
import json

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')
django.setup()

from trip_planner.models import Trip, LogSheet

# Get the last created trip
trip = Trip.objects.last()
print(f"Trip ID: {trip.id}")
print(f"Log sheets count: {trip.logs.count()}")
print()

# Print all log sheets
for log in trip.logs.all():
    print(f"=== Day {log.day_number} ===")
    print(f"Summary: {json.dumps(log.summary, indent=2)}")
    print("Graph Points:")
    for point in log.graph_points:
        print(f"  {point['time']} - {point['status']}")
    print()