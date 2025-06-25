import math
from datetime import datetime, timedelta
from typing import List, Dict, Tuple
from .models import Trip, RouteSegment, LogSheet

class TripPlanningService:
    def __init__(self):
        pass

    PICKUP_DURATION = 60  # minutes
    DROPOFF_DURATION = 60  # minutes
    FUEL_INTERVAL_KM = 1609  # ~1000 miles
    AVERAGE_SPEED_KMH = 100
    MAX_DRIVING_HOURS = 11

    def plan_trip(self, trip_data: Dict) -> Trip:
        trip = Trip.objects.create(**trip_data)
        
        # Calculate route segments
        segments = self._calculate_route_segments(trip)
        
        # Create route segments
        for i, segment_data in enumerate(segments):
            RouteSegment.objects.create(
                trip=trip,
                sequence_order=i,
                **segment_data
            )
        
        # Generate log sheets
        self._generate_log_sheets(trip)
        
        # Update trip totals
        total_distance = sum(s.get('distance_km', 0) for s in segments if s.get('distance_km'))
        estimated_days = self._estimate_trip_days(segments)
        
        trip.total_distance_km = total_distance
        trip.estimated_days = estimated_days
        trip.save()
        
        return trip
    
    def _calculate_route_segments(self, trip: Trip) -> List[Dict]:
        segments = []
        current_hours_used = 0
        sequence = 0
        
        # Drive to pickup
        pickup_distance = self._calculate_distance(
            trip.current_location, trip.pickup_location
        )
        pickup_drive_hours = pickup_distance / self.AVERAGE_SPEED_KMH
        
        segments.extend(self._create_drive_segments(
            start_location=trip.current_location,
            end_location=trip.pickup_location,
            distance_km=pickup_distance,
            drive_hours=pickup_drive_hours,
            current_cycle_hours=trip.current_cycle_used_hours,
            sequence_start=sequence
        ))
        sequence = len(segments)
        current_hours_used += pickup_drive_hours
        
        # Pickup event
        segments.append({
            'type': 'pickup',
            'start_location': trip.pickup_location,
            'end_location': trip.pickup_location,
            'duration_minutes': self.PICKUP_DURATION,
        })
        sequence += 1
        current_hours_used += self.PICKUP_DURATION / 60
        
        # Drive to dropoff
        dropoff_distance = self._calculate_distance(
            trip.pickup_location, trip.dropoff_location
        )
        dropoff_drive_hours = dropoff_distance / self.AVERAGE_SPEED_KMH
        
        segments.extend(self._create_drive_segments(
            start_location=trip.pickup_location,
            end_location=trip.dropoff_location,
            distance_km=dropoff_distance,
            drive_hours=dropoff_drive_hours,
            current_cycle_hours=trip.current_cycle_used_hours + current_hours_used,
            sequence_start=sequence
        ))
        sequence = len(segments)
        
        # Dropoff event
        segments.append({
            'type': 'dropoff',
            'start_location': trip.dropoff_location,
            'end_location': trip.dropoff_location,
            'duration_minutes': self.DROPOFF_DURATION,
        })
        
        return segments
    
    def _create_drive_segments(self, start_location: Dict, end_location: Dict, 
                              distance_km: float, drive_hours: float, 
                              current_cycle_hours: float, sequence_start: int) -> List[Dict]:
        segments = []
        
        # For simplicity, create one drive segment and add refuel stops every 1000 miles
        current_distance = 0
        while current_distance < distance_km:
            # Calculate remaining distance
            remaining_distance = distance_km - current_distance
            
            # Check if we need a fuel stop
            segment_distance = min(remaining_distance, self.FUEL_INTERVAL_KM)
            segment_hours = (segment_distance / distance_km) * drive_hours
            
            # Calculate current and end locations for this segment
            progress_start = current_distance / distance_km
            progress_end = (current_distance + segment_distance) / distance_km
            
            segment_start = self._interpolate_location(start_location, end_location, progress_start)
            segment_end = self._interpolate_location(start_location, end_location, progress_end)
            
            # Add drive segment
            segments.append({
                'type': 'drive',
                'start_location': segment_start,
                'end_location': segment_end,
                'distance_km': segment_distance,
                'duration_minutes': int(segment_hours * 60),
            })
            
            current_distance += segment_distance
            
            # Add refuel stop if not at destination and segment was full fuel interval
            if current_distance < distance_km and segment_distance >= self.FUEL_INTERVAL_KM:
                segments.append({
                    'type': 'refuel',
                    'start_location': segment_end,
                    'end_location': segment_end,
                    'duration_minutes': 30,
                })
        
        # Add mandatory rest breaks based on driving hours
        if drive_hours > self.MAX_DRIVING_HOURS:
            segments.append({
                'type': 'rest',
                'start_location': end_location,
                'end_location': end_location,
                'duration_minutes': 10 * 60,  # 10 hours mandatory rest
            })
        elif drive_hours > 8:
            # Add 30-minute break after 8 hours
            segments.append({
                'type': 'break',
                'start_location': end_location,
                'end_location': end_location,
                'duration_minutes': 30,
            })
        
        return segments
    
    def _calculate_distance(self, location1: Dict, location2: Dict) -> float:
        # Haversine formula for great circle distance
        lat1, lon1 = math.radians(location1['lat']), math.radians(location1['lng'])
        lat2, lon2 = math.radians(location2['lat']), math.radians(location2['lng'])
        
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        
        a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
        c = 2 * math.asin(math.sqrt(a))
        
        # Earth's radius in kilometers
        r = 6371
        return c * r
    
    def _interpolate_location(self, start: Dict, end: Dict, ratio: float) -> Dict:
        return {
            'lat': start['lat'] + (end['lat'] - start['lat']) * ratio,
            'lng': start['lng'] + (end['lng'] - start['lng']) * ratio,
        }
    
    def _format_location(self, location: Dict) -> str:
        """Format location dict into readable string"""
        if not location:
            return "UNKNOWN"
        
        # If location has city/state info, use that
        if 'city' in location and 'state' in location:
            return f"{location['city']}, {location['state']}"
        
        # Otherwise format coordinates
        lat = location.get('lat', 0)
        lng = location.get('lng', 0)
        return f"{lat:.2f}, {lng:.2f}"
    
    def _estimate_trip_days(self, segments: List[Dict]) -> int:
        total_hours = sum(
            s.get('duration_minutes', 0) / 60 
            for s in segments
        )
        return math.ceil(total_hours / 24)
    
    def _generate_log_sheets(self, trip: Trip):
        segments = list(trip.segments.all())
        if not segments:
            LogSheet.objects.create(
                trip=trip,
                day_number=1,
                graph_points=[
                    {'time': '06:00', 'status': 'off-duty'},
                    {'time': '08:00', 'status': 'on-duty'},
                    {'time': '18:00', 'status': 'off-duty'}
                ],
                summary={
                    'driving_hours': 0,
                    'on_duty_hours': 10,
                    'rest_hours': 14
                }
            )
            return

        # Start processing segments with HOS compliance
        current_time_minutes = 0  # Start at 00:00 (midnight)
        day_number = 1
        current_day_start = 0
        
        # Daily tracking
        daily_driving_minutes = 0
        daily_on_duty_minutes = 0
        continuous_driving_minutes = 0
        
        # Graph points for current day - start off-duty
        graph_points = [{'time': '00:00', 'status': 'off-duty'}]
        
        # Process each segment
        for i, segment in enumerate(segments):
            segment_duration = segment.duration_minutes or 0
            
            # Check if we need a 30-minute break after 8 hours of continuous driving
            if (segment.type == 'drive' and 
                continuous_driving_minutes >= 480 and  # 8 hours = 480 minutes
                segment_duration > 0):
                
                # Insert mandatory 30-minute break
                self._add_graph_point(graph_points, current_time_minutes, current_day_start, 'break')
                current_time_minutes += 30
                continuous_driving_minutes = 0
            
            # Check if we need to start a new day due to HOS limits
            if self._needs_new_day(segment, segment_duration, daily_driving_minutes, 
                                 daily_on_duty_minutes, current_time_minutes, current_day_start):
                
                # End current day - go off-duty
                self._add_graph_point(graph_points, current_time_minutes, current_day_start, 'off-duty')
                
                # Create log sheet for completed day
                self._create_log_sheet(trip, day_number, graph_points, 
                                     daily_driving_minutes, daily_on_duty_minutes)
                
                # Start new day after 10-hour mandatory rest
                day_number += 1
                current_time_minutes += 600  # 10 hours = 600 minutes
                current_day_start = current_time_minutes
                
                # Reset daily counters
                daily_driving_minutes = 0
                daily_on_duty_minutes = 0
                continuous_driving_minutes = 0
                
                # New day starts off-duty
                graph_points = [{'time': '00:00', 'status': 'off-duty'}]
            
            # Process the current segment
            if segment.type == 'rest':
                # Rest periods are rest status
                location = self._format_location(segment.start_location)
                annotation = "REST"
                self._add_graph_point(graph_points, current_time_minutes, current_day_start, 'rest', location, annotation)
                current_time_minutes += segment_duration
                continuous_driving_minutes = 0
                
            elif segment.type == 'drive':
                # Start driving
                start_location = self._format_location(segment.start_location)
                end_location = self._format_location(segment.end_location)
                annotation = f"DRIVING {start_location} TO {end_location}"
                self._add_graph_point(graph_points, current_time_minutes, current_day_start, 'driving', start_location, annotation)
                current_time_minutes += segment_duration
                daily_driving_minutes += segment_duration
                daily_on_duty_minutes += segment_duration
                continuous_driving_minutes += segment_duration
                
            elif segment.type in ['pickup', 'dropoff', 'refuel']:
                # On-duty activities
                location = self._format_location(segment.start_location)
                annotation = segment.type.upper()
                self._add_graph_point(graph_points, current_time_minutes, current_day_start, 'on-duty', location, annotation)
                current_time_minutes += segment_duration
                daily_on_duty_minutes += segment_duration
                continuous_driving_minutes = 0
                
            elif segment.type == 'break':
                # Break periods
                location = self._format_location(segment.start_location)
                annotation = "BREAK"
                self._add_graph_point(graph_points, current_time_minutes, current_day_start, 'break', location, annotation)
                current_time_minutes += segment_duration
                continuous_driving_minutes = 0
        
        # End final day - go off-duty
        self._add_graph_point(graph_points, current_time_minutes, current_day_start, 'off-duty')
        
        # Create final log sheet
        self._create_log_sheet(trip, day_number, graph_points, 
                             daily_driving_minutes, daily_on_duty_minutes)
    
    def _needs_new_day(self, segment, segment_duration, daily_driving_minutes, 
                       daily_on_duty_minutes, current_time_minutes, current_day_start):
        # Check if adding this segment would violate HOS rules
        
        # 11-hour driving limit
        if segment.type == 'drive' and daily_driving_minutes + segment_duration > 660:  # 11 hours = 660 minutes
            return True
            
        # 14-hour on-duty limit (for driving/on-duty activities)
        if segment.type in ['drive', 'pickup', 'dropoff', 'refuel']:
            if daily_on_duty_minutes + segment_duration > 840:  # 14 hours = 840 minutes
                return True
        
        # Check if current day would exceed 24 hours
        time_in_current_day = current_time_minutes - current_day_start
        if time_in_current_day + segment_duration > 1440:  # 24 hours = 1440 minutes
            return True
            
        return False
    
    def _add_graph_point(self, graph_points, current_time_minutes, current_day_start, status, location=None, annotation=None):
        # Convert absolute time to time within the current day
        time_in_day = (current_time_minutes - current_day_start) % 1440
        hours = time_in_day // 60
        minutes = time_in_day % 60
        time_str = f"{hours:02d}:{minutes:02d}"
        
        # Avoid duplicate consecutive status entries
        if not graph_points or graph_points[-1]['status'] != status:
            point = {
                'time': time_str,
                'status': status
            }
            
            # Add location if provided
            if location:
                point['location'] = location
                
            # Add annotation if provided  
            if annotation:
                point['annotation'] = annotation
                
            graph_points.append(point)
    
    def _create_log_sheet(self, trip, day_number, graph_points, daily_driving_minutes, daily_on_duty_minutes):
        driving_hours = round(daily_driving_minutes / 60, 1)
        on_duty_hours = round(daily_on_duty_minutes / 60, 1)
        rest_hours = round(24 - on_duty_hours, 1)
        
        LogSheet.objects.create(
            trip=trip,
            day_number=day_number,
            graph_points=graph_points.copy(),
            summary={
                'driving_hours': driving_hours,
                'on_duty_hours': on_duty_hours,
                'rest_hours': rest_hours
            }
        )
