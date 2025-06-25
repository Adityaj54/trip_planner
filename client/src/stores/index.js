import { TripStore } from './TripStore';

export const tripStore = TripStore.create({
  trips: [],
  currentTripId: undefined,
  currentTripLogs: undefined,
  loading: false,
  error: undefined
});