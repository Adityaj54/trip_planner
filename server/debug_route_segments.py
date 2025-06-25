#!/usr/bin/env python3

import os
import sys
import django

# Add the project path
sys.path.append('/Users/adityaaralimara/IdeaProjects/lorry/server')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')

# Setup Django
django.setup()

from trip_planner.models import Trip, RouteSegment

# Get a trip and examine its route segments
trip = Trip.objects.first()
if trip:
    print(f"Trip ID: {trip.id}")
    print(f"Total Distance: {trip.total_distance_km} km")
    print(f"Estimated Days: {trip.estimated_days}")
    print("\nRoute Segments:")
    
    segments = RouteSegment.objects.filter(trip=trip).order_by('sequence_order')
    for segment in segments:
        print(f"  {segment.sequence_order}: {segment.type} - {segment.duration_minutes}min")
        if segment.distance_km:
            print(f"      Distance: {segment.distance_km} km")
        if segment.start_location:
            print(f"      Start: {segment.start_location}")
        if segment.end_location:
            print(f"      End: {segment.end_location}")
        print()
    
    # Count by type
    segment_counts = {}
    for segment in segments:
        segment_counts[segment.type] = segment_counts.get(segment.type, 0) + 1
    
    print("Segment counts:")
    for seg_type, count in segment_counts.items():
        print(f"  {seg_type}: {count}")
else:
    print("No trips found")