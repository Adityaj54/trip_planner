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
from trip_planner.serializers import TripLogsSerializer

# Get a trip and test the serializer
trip = Trip.objects.first()
if trip:
    print(f"Testing serializer for trip: {trip.id}")
    
    serializer = TripLogsSerializer()
    data = serializer.to_representation(trip)
    
    print("Serialized data:")
    print(json.dumps(data, indent=2))
else:
    print("No trips found")