  The create_trip_plan function (views.py:13-22) is a Django REST API endpoint that creates comprehensive trip plans for ELD (Electronic Logging Device) compliance. Here's a detailed breakdown:

  Main Function Flow

  create_trip_plan(request) (views.py:13-22):
  - serializer = TripCreateSerializer(data=request.data) - Validates incoming JSON data
  - trip_service = TripPlanningService() - Creates service instance for business logic
  - trip = trip_service.plan_trip(serializer.validated_data) - Generates complete trip plan
  - response_serializer = TripSerializer(trip) - Formats response data
  - Returns HTTP 201 with trip data or HTTP 400 with validation errors

  Input Data Structure (TripCreateSerializer)

  Required fields (serializers.py:17-21):
  - current_location - JSON with 'lat' and 'lng' coordinates of driver's current position
  - pickup_location - JSON with 'lat' and 'lng' coordinates where cargo is picked up
  - dropoff_location - JSON with 'lat' and 'lng' coordinates where cargo is delivered
  - current_cycle_used_hours - Integer (0-70) representing hours already used in current HOS cycle

  Validation methods (serializers.py:23-36):
  - Each location validator ensures proper JSON structure with required lat/lng fields

  Core Planning Service (TripPlanningService)

  plan_trip(trip_data) method (services.py:40-65):

  1. Trip Creation (services.py:41): Creates Trip database record with input data
  2. Route Calculation (services.py:44): Calls _calculate_route_segments() to plan detailed route
  3. Segment Storage (services.py:47-52): Saves each route segment to database with sequence order
  4. Log Generation (services.py:55): Creates HOS compliance log sheets
  5. Trip Totals (services.py:58-63): Calculates total distance and estimated days, saves to trip

  Route Segment Calculation Details

  _calculate_route_segments(trip) (services.py:67-123):

  Variables:
  - segments - List storing all route segments
  - current_hours_used - Tracks accumulated driving/duty hours
  - sequence - Maintains segment ordering

  Step-by-step process:

  1. Drive to Pickup (services.py:72-87):
    - pickup_distance - Calculated using Haversine formula
    - pickup_drive_hours - Distance divided by average speed (100 km/h)
    - Creates drive segments with fuel stops and rest breaks as needed
  2. Pickup Event (services.py:89-97):
    - Fixed 60-minute duration for loading
    - Updates hour tracking
  3. Drive to Dropoff (services.py:99-113):
    - Similar to pickup drive calculation
    - Accounts for accumulated hours from previous segments
  4. Dropoff Event (services.py:115-121):
    - Fixed 60-minute duration for unloading

  Drive Segment Creation

  _create_drive_segments() (services.py:125-184):

  Key variables:
  - FUEL_INTERVAL_KM = 1609 - Forces fuel stop every ~1000 miles
  - segment_distance - Chunk of total distance for each segment
  - progress_start/end - Ratios for location interpolation

  Logic:
  - Breaks long drives into chunks at fuel intervals
  - Adds mandatory rest periods for HOS compliance
  - Uses location interpolation for intermediate waypoints

  HOS Compliance Service

  HOSComplianceService constants (services.py:8-13):
  - MAX_DRIVING_HOURS = 11 - Federal limit for daily driving
  - MAX_ON_DUTY_HOURS = 14 - Daily on-duty time limit
  - MAX_CYCLE_HOURS = 70 - Weekly cycle limit
  - MIN_REST_HOURS = 10 - Required rest between shifts

  Database Models

  Trip model (models.py:5-16):
  - id - UUID primary key
  - current_location/pickup_location/dropoff_location - JSON coordinates
  - current_cycle_used_hours - HOS tracking
  - total_distance_km/estimated_days - Calculated values

  RouteSegment model (models.py:19-41):
  - type - Segment category (drive, pickup, dropoff, refuel, rest, break)
  - start_location/end_location - JSON coordinates
  - duration_minutes/distance_km - Segment metrics
  - sequence_order - Maintains route order

  LogSheet model (models.py:44-62):
  - day_number - Day of trip
  - graph_points - JSON array of time/status points for HOS graph
  - summary - JSON with driving/duty/rest hour totals

  The system ensures DOT HOS compliance by calculating mandatory breaks, rest periods, and tracking cumulative hours throughout the trip plan.



⏺ _create_drive_segments Method Explanation

  This method breaks a single long drive into multiple segments with fuel stops and mandatory HOS compliance breaks.

  Method Signature (services.py:125-127)

  def _create_drive_segments(self, start_location: Dict, end_location: Dict, 
                            distance_km: float, drive_hours: float, 
                            current_cycle_hours: float, sequence_start: int) -> List[Dict]:

  Parameters:
  - start_location - Starting coordinates {'lat': X, 'lng': Y}
  - end_location - Destination coordinates {'lat': X, 'lng': Y}
  - distance_km - Total distance for this drive segment
  - drive_hours - Total estimated driving time
  - current_cycle_hours - Driver's accumulated hours (for HOS compliance)
  - sequence_start - Starting sequence number for ordering

  Core Logic - Distance Chunking (services.py:128-166)

  Variables:
  - segments = [] (line 128) - Accumulates all created segments
  - current_distance = 0 (line 131) - Tracks progress through total distance
  - FUEL_INTERVAL_KM = 1609 (~1000 miles) - Maximum distance before fuel stop

  Main Loop (services.py:132-166):

  1. Distance Calculation (lines 134-138):
    - remaining_distance - How much distance is left
    - segment_distance - Smaller of remaining distance or fuel interval
    - segment_hours - Proportional time for this chunk
  2. Location Interpolation (lines 141-145):
    - progress_start - Ratio (0.0-1.0) of journey completed at segment start
    - progress_end - Ratio at segment end
    - segment_start/end - Interpolated GPS coordinates along the route
  3. Drive Segment Creation (lines 148-154):
  Creates segment dictionary with:
    - type: 'drive' - Identifies this as driving time
    - start_location/end_location - GPS coordinates
    - distance_km - Distance for this chunk
    - duration_minutes - Driving time converted to minutes
  4. Fuel Stop Logic (lines 158-165):
    - Adds refuel segment if not at final destination AND segment was full fuel interval
    - 30-minute duration for refueling
    - Same location for start/end (stationary activity)

  HOS Compliance Breaks (services.py:167-183)

  Mandatory Rest (lines 168-174):
  - Condition: drive_hours > 11 (MAX_DRIVING_HOURS)
  - Action: Add 10-hour rest period
  - Location: At final destination

  Break Requirement (lines 175-182):
  - Condition: drive_hours > 8 but ≤ 11
  - Action: Add 30-minute break
  - Location: At final destination

  Example Walkthrough

  For a 2000km drive (Dallas to Los Angeles):

  1. First iteration:
    - current_distance = 0
    - segment_distance = min(2000, 1609) = 1609km
    - Creates drive segment for first 1609km
    - current_distance = 1609
    - Adds 30-minute refuel stop
  2. Second iteration:
    - remaining_distance = 391km
    - segment_distance = min(391, 1609) = 391km
    - Creates drive segment for remaining 391km
    - current_distance = 2000 (loop ends)
  3. HOS compliance:
    - If total drive > 11 hours: adds 10-hour rest
    - If 8-11 hours: adds 30-minute break

  Result: List of segments including drives, fuel stops, and mandatory breaks ensuring DOT compliance.
