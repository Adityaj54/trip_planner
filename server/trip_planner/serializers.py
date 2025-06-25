from rest_framework import serializers
from .models import Trip, RouteSegment, LogSheet


class RouteSegmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = RouteSegment
        fields = ['type', 'start_location', 'end_location', 'duration_minutes', 'distance_km']


class LogSheetSerializer(serializers.ModelSerializer):
    day = serializers.IntegerField(source='day_number')
    
    class Meta:
        model = LogSheet
        fields = ['day', 'graph_points', 'summary']


class TripCreateSerializer(serializers.Serializer):
    current_location = serializers.JSONField()
    pickup_location = serializers.JSONField()
    dropoff_location = serializers.JSONField()
    current_cycle_used_hours = serializers.IntegerField(min_value=0, max_value=70)

    def validate_current_location(self, value):
        if not isinstance(value, dict) or 'lat' not in value or 'lng' not in value:
            raise serializers.ValidationError("Location must have 'lat' and 'lng' fields")
        return value

    def validate_pickup_location(self, value):
        if not isinstance(value, dict) or 'lat' not in value or 'lng' not in value:
            raise serializers.ValidationError("Location must have 'lat' and 'lng' fields")
        return value

    def validate_dropoff_location(self, value):
        if not isinstance(value, dict) or 'lat' not in value or 'lng' not in value:
            raise serializers.ValidationError("Location must have 'lat' and 'lng' fields")
        return value


class TripSerializer(serializers.ModelSerializer):
    route = RouteSegmentSerializer(source='segments', many=True, read_only=True)
    
    class Meta:
        model = Trip
        fields = [
            'id', 'total_distance_km', 'estimated_days', 'route'
        ]
        read_only_fields = ['id', 'total_distance_km', 'estimated_days']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        return {
            'trip_id': str(data['id']),
            'total_distance_km': data['total_distance_km'],
            'estimated_days': data['estimated_days'],
            'route': data['route']
        }


class TripDetailSerializer(serializers.ModelSerializer):
    route = RouteSegmentSerializer(source='segments', many=True, read_only=True)
    
    class Meta:
        model = Trip
        fields = [
            'id', 'created_at', 'current_location', 'pickup_location', 
            'dropoff_location', 'current_cycle_used_hours', 
            'total_distance_km', 'estimated_days', 'route'
        ]
        read_only_fields = ['id', 'created_at', 'total_distance_km', 'estimated_days']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['trip_id'] = str(data.pop('id'))
        return data


class TripLogsSerializer(serializers.Serializer):
    trip_id = serializers.UUIDField()
    logs = LogSheetSerializer(many=True)

    def to_representation(self, instance):
        return {
            'trip_id': str(instance.id),
            'logs': LogSheetSerializer(instance.logs.all(), many=True).data
        }