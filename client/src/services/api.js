import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const tripService = {
  createTrip: async (tripData) => {
    const response = await api.post('/trip-plans/', tripData);
    return response.data;
  },

  getTripDetails: async (tripId) => {
    const response = await api.get(`/trip-plans/${tripId}/`);
    return response.data;
  },

  getTripLogs: async (tripId) => {
    const response = await api.get(`/trip-plans/${tripId}/logs/`);
    return response.data;
  }
};