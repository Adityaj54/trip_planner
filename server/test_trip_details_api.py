#!/usr/bin/env python3

import os
import sys
import django
import json

# Add the project path
sys.path.append('/Users/adityaaralimara/IdeaProjects/lorry/server')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')

# Setup Django
django.setup()

from trip_planner.models import Trip
from trip_planner.serializers import TripDetailSerializer

# Get a trip and test the serializer
trip = Trip.objects.first()
if trip:
    print(f"Testing TripDetailSerializer for trip: {trip.id}")
    
    serializer = TripDetailSerializer(trip)
    data = serializer.data
    
    print("Serialized trip details data:")
    print(json.dumps(data, indent=2))
    
    # Check if route is included
    if 'route' in data:
        print(f"\nRoute has {len(data['route'])} segments")
        for i, segment in enumerate(data['route']):
            print(f"  {i}: {segment['type']}")
    else:
        print("\nNo route data in serialized output")
else:
    print("No trips found")