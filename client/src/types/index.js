export interface Location {
  lat: number;
  lng: number;
}

export interface TripCreateRequest {
  current_location: Location;
  pickup_location: Location;
  dropoff_location: Location;
  current_cycle_used_hours: number;
}

export interface RouteSegment {
  type: 'drive' | 'pickup' | 'dropoff' | 'refuel' | 'rest' | 'break';
  start_location?: Location;
  end_location?: Location;
  distance_km?: number;
  duration_minutes?: number;
}

export interface Trip {
  trip_id: string;
  created_at?: string;
  current_location: Location;
  pickup_location: Location;
  dropoff_location: Location;
  current_cycle_used_hours: number;
  total_distance_km: number;
  estimated_days: number;
  route?: RouteSegment[];
}

export interface LogGraphPoint {
  time: string;
  status: 'off-duty' | 'on-duty' | 'driving' | 'break';
}

export interface LogSummary {
  driving_hours: number;
  on_duty_hours: number;
  rest_hours: number;
}

export interface DayLog {
  day_number: number;
  graph_points: LogGraphPoint[];
  summary: LogSummary;
}

export interface TripLogs {
  trip_id: string;
  logs: DayLog[];
}