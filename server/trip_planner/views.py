from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Trip
from .serializers import (
    TripCreateSerializer, TripSerializer, TripDetailSerializer, TripLogsSerializer
)
from .services import TripPlanningService


@api_view(['POST'])
def create_trip_plan(request):
    serializer = TripCreateSerializer(data=request.data)
    if serializer.is_valid():
        trip_service = TripPlanningService()
        trip = trip_service.plan_trip(serializer.validated_data)
        
        response_serializer = TripSerializer(trip)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_trip_plan(request, trip_id):
    trip = get_object_or_404(Trip, id=trip_id)
    serializer = TripDetailSerializer(trip)
    return Response(serializer.data)


@api_view(['GET'])
def get_trip_logs(request, trip_id):
    trip = get_object_or_404(Trip, id=trip_id)
    serializer = TripLogsSerializer(trip)
    return Response(serializer.data)
