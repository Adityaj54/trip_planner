import { types, flow } from 'mobx-state-tree';
import { tripService } from '../services/api';

const Location = types.model('Location', {
  lat: types.number,
  lng: types.number
});

const RouteSegment = types.model('RouteSegment', {
  type: types.enumeration(['drive', 'pickup', 'dropoff', 'refuel', 'rest', 'break']),
  start_location: types.maybeNull(Location),
  end_location: types.maybeNull(Location),
  distance_km: types.maybeNull(types.number),
  duration_minutes: types.maybeNull(types.number)
});

const Trip = types.model('Trip', {
  trip_id: types.string,
  created_at: types.maybe(types.string),
  current_location: types.maybeNull(Location),
  pickup_location: types.maybeNull(Location),
  dropoff_location: types.maybeNull(Location),
  current_cycle_used_hours: types.maybe(types.number),
  total_distance_km: types.number,
  estimated_days: types.number,
  route: types.maybe(types.array(RouteSegment))
});

const LogGraphPoint = types.model('LogGraphPoint', {
  time: types.string,
  status: types.enumeration(['off-duty', 'on-duty', 'driving', 'break', 'rest', 'sleeper']),
  location: types.maybe(types.string),
  annotation: types.maybe(types.string)
});

const LogSummary = types.model('LogSummary', {
  driving_hours: types.number,
  on_duty_hours: types.number,
  rest_hours: types.number
});

const DayLog = types.model('DayLog', {
  day: types.number,
  graph_points: types.array(LogGraphPoint),
  summary: LogSummary
});

const TripLogs = types.model('TripLogs', {
  trip_id: types.string,
  logs: types.array(DayLog)
});

export const TripStore = types
  .model('TripStore', {
    trips: types.array(Trip),
    currentTripId: types.maybe(types.string),
    currentTripLogs: types.maybe(TripLogs),
    loading: false,
    error: types.maybe(types.string)
  })
  .views(self => ({
    get currentTrip() {
      return self.currentTripId ? self.trips.find(trip => trip.trip_id === self.currentTripId) : undefined;
    }
  }))
  .actions(self => ({
    setLoading(loading) {
      self.loading = loading;
    },
    
    setError(error) {
      self.error = error;
    },
    
    clearError() {
      self.error = undefined;
    },
    
    setCurrentTrip(trip) {
      self.currentTripId = trip ? trip.trip_id : undefined;
    },
    
    createTrip: flow(function* (tripData) {
      self.loading = true;
      self.error = undefined;
      
      try {
        const trip = yield tripService.createTrip(tripData);
        // The create response doesn't include all fields, so load full details
        const fullTrip = yield tripService.getTripDetails(trip.trip_id);
        const tripInstance = Trip.create(fullTrip);
        self.trips.push(tripInstance);
        self.currentTripId = tripInstance.trip_id;
        return tripInstance;
      } catch (error) {
        self.error = error instanceof Error ? error.message : 'Failed to create trip';
        throw error;
      } finally {
        self.loading = false;
      }
    }),
    
    loadTripDetails: flow(function* (tripId) {
      self.loading = true;
      self.error = undefined;
      
      try {
        const trip = yield tripService.getTripDetails(tripId);
        const tripInstance = Trip.create(trip);
        self.currentTripId = tripInstance.trip_id;
        
        const existingIndex = self.trips.findIndex(t => t.trip_id === tripId);
        if (existingIndex >= 0) {
          self.trips[existingIndex] = tripInstance;
        } else {
          self.trips.push(tripInstance);
        }
      } catch (error) {
        self.error = error instanceof Error ? error.message : 'Failed to load trip details';
        throw error;
      } finally {
        self.loading = false;
      }
    }),
    
    loadTripLogs: flow(function* (tripId) {
      self.loading = true;
      self.error = undefined;
      
      try {
        const logs = yield tripService.getTripLogs(tripId);
        self.currentTripLogs = TripLogs.create(logs);
      } catch (error) {
        self.error = error instanceof Error ? error.message : 'Failed to load trip logs';
        throw error;
      } finally {
        self.loading = false;
      }
    })
  }));