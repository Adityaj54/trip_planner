import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { tripStore } from '../stores';
import { ClickableMap } from './ClickableMap';

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  
  &:hover {
    background: #0056b3;
  }
  
  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  margin-top: 10px;
  padding: 10px;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
`;

export const TripPlanForm = observer(({ onTripCreated }) => {
  const [formData, setFormData] = useState({
    currentLocation: null,
    pickupLocation: null,
    dropoffLocation: null,
    currentCycleHours: ''
  });

  const handleLocationChange = (field, location) => {
    setFormData(prev => ({ ...prev, [field]: location }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!formData.currentLocation || !formData.pickupLocation || !formData.dropoffLocation) {
        tripStore.setError('Please select all three locations on the maps');
        return;
      }

      const tripRequest = {
        current_location: formData.currentLocation,
        pickup_location: formData.pickupLocation,
        dropoff_location: formData.dropoffLocation,
        current_cycle_used_hours: parseInt(formData.currentCycleHours)
      };

      await tripStore.createTrip(tripRequest);
      onTripCreated?.();
    } catch (error) {
      console.error('Failed to create trip:', error);
    }
  };

  return (
    <FormContainer>
      <Title>Plan New Trip</Title>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Current Location</Label>
          <ClickableMap
            label="Current Location"
            value={formData.currentLocation}
            onChange={(location) => handleLocationChange('currentLocation', location)}
            defaultCenter={[40.7128, -74.0060]} // New York area
          />
        </FormGroup>

        <FormGroup>
          <Label>Pickup Location</Label>
          <ClickableMap
            label="Pickup Location"
            value={formData.pickupLocation}
            onChange={(location) => handleLocationChange('pickupLocation', location)}
            defaultCenter={[41.8781, -87.6298]} // Chicago area
          />
        </FormGroup>

        <FormGroup>
          <Label>Drop-off Location</Label>
          <ClickableMap
            label="Drop-off Location"
            value={formData.dropoffLocation}
            onChange={(location) => handleLocationChange('dropoffLocation', location)}
            defaultCenter={[34.0522, -118.2437]} // Los Angeles area
          />
        </FormGroup>

        <FormGroup>
          <Label>Current Cycle Used Hours</Label>
          <Input
            type="number"
            min="0"
            max="70"
            placeholder="Hours (0-70)"
            value={formData.currentCycleHours}
            onChange={(e) => handleInputChange('currentCycleHours', e.target.value)}
            required
          />
        </FormGroup>

        <Button type="submit" disabled={tripStore.loading}>
          {tripStore.loading ? 'Creating Trip...' : 'Create Trip Plan'}
        </Button>

        {tripStore.error && (
          <ErrorMessage>{tripStore.error}</ErrorMessage>
        )}
      </form>
    </FormContainer>
  );
});