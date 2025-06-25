import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  margin-bottom: 15px;
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 10px;
  align-items: center;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const LocationButton = styled.button`
  padding: 10px 15px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  white-space: nowrap;
  
  &:hover {
    background: #218838;
  }
`;

const LocationDisplay = styled.div`
  margin-top: 10px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
  font-size: 14px;
  color: #666;
`;

const MapPlaceholder = styled.div`
  height: 200px;
  background: #e9ecef;
  border: 2px dashed #adb5bd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  margin: 10px 0;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #dee2e6;
    border-color: #007bff;
  }
`;

// Predefined common locations
const commonLocations = {
  'New York, NY': { lat: 40.7128, lng: -74.0060 },
  'Chicago, IL': { lat: 41.8781, lng: -87.6298 },
  'Los Angeles, CA': { lat: 34.0522, lng: -118.2437 },
  'Houston, TX': { lat: 29.7604, lng: -95.3698 },
  'Phoenix, AZ': { lat: 33.4484, lng: -112.0740 },
  'Philadelphia, PA': { lat: 39.9526, lng: -75.1652 },
  'San Antonio, TX': { lat: 29.4241, lng: -98.4936 },
  'San Diego, CA': { lat: 32.7157, lng: -117.1611 },
  'Dallas, TX': { lat: 32.7767, lng: -96.7970 },
  'San Jose, CA': { lat: 37.3382, lng: -121.8863 }
};

const QuickSelect = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  margin-bottom: 10px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

export const SimpleLocationPicker = ({ label, value, onChange, defaultCenter = [39.8283, -98.5795] }) => {
  const [manualLat, setManualLat] = useState(value?.lat || '');
  const [manualLng, setManualLng] = useState(value?.lng || '');

  const handleManualInput = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    
    if (!isNaN(lat) && !isNaN(lng)) {
      onChange({ lat, lng });
    }
  };

  const handleQuickSelect = (e) => {
    const locationName = e.target.value;
    if (locationName && commonLocations[locationName]) {
      const location = commonLocations[locationName];
      setManualLat(location.lat);
      setManualLng(location.lng);
      onChange(location);
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setManualLat(location.lat);
          setManualLng(location.lng);
          onChange(location);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Could not get your current location. Please enter coordinates manually or select from the dropdown.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <Container>
      <QuickSelect onChange={handleQuickSelect} defaultValue="">
        <option value="">Select a common location for {label.toLowerCase()}</option>
        {Object.keys(commonLocations).map(city => (
          <option key={city} value={city}>{city}</option>
        ))}
      </QuickSelect>
      
      <InputGrid>
        <Input
          type="number"
          step="any"
          placeholder="Latitude"
          value={manualLat}
          onChange={(e) => setManualLat(e.target.value)}
        />
        <Input
          type="number"
          step="any"
          placeholder="Longitude"
          value={manualLng}
          onChange={(e) => setManualLng(e.target.value)}
        />
        <LocationButton type="button" onClick={handleManualInput}>
          Set Location
        </LocationButton>
      </InputGrid>

      <LocationButton 
        type="button" 
        onClick={handleGetCurrentLocation}
        style={{ width: '100%', marginTop: '10px' }}
      >
        📍 Use My Current Location
      </LocationButton>
      
      <MapPlaceholder onClick={() => window.open(`https://www.google.com/maps/@${value?.lat || defaultCenter[0]},${value?.lng || defaultCenter[1]},10z`, '_blank')}>
        {value ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{label}</div>
            <div>📍 {value.lat.toFixed(6)}, {value.lng.toFixed(6)}</div>
            <div style={{ fontSize: '12px', marginTop: '5px' }}>Click to view on Google Maps</div>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div>Click to open Google Maps</div>
            <div style={{ fontSize: '12px', marginTop: '5px' }}>Select location from dropdown or enter coordinates above</div>
          </div>
        )}
      </MapPlaceholder>
      
      {value && (
        <LocationDisplay>
          <strong>{label}:</strong> {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
        </LocationDisplay>
      )}
    </Container>
  );
};