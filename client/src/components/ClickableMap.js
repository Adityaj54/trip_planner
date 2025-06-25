import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styled from 'styled-components';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapWrapper = styled.div`
  height: 400px;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #ddd;
  margin-bottom: 15px;
`;

const Instructions = styled.div`
  background: #e3f2fd;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 15px;
  font-size: 14px;
  color: #1565c0;
  border-left: 4px solid #2196f3;
`;

const LocationInfo = styled.div`
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  margin-top: 15px;
  border-left: 4px solid #28a745;
`;

const LocationLabel = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
  font-size: 16px;
`;

const Coordinates = styled.div`
  font-family: monospace;
  font-size: 14px;
  color: #007bff;
  background: white;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  margin-bottom: 10px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
  }
`;

const ClearButton = styled(Button)`
  background: #dc3545;
  color: white;
  
  &:hover {
    background: #c82333;
  }
`;

const UseLocationButton = styled(Button)`
  background: #17a2b8;
  color: white;
  
  &:hover {
    background: #138496;
  }
`;

// Component that handles map clicks
function LocationSelector({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onLocationSelect({
        lat: parseFloat(lat.toFixed(6)),
        lng: parseFloat(lng.toFixed(6))
      });
    },
  });
  
  return null;
}

// Component that updates map view when location changes
function MapController({ location }) {
  const map = useMapEvents({});
  
  useEffect(() => {
    if (location) {
      map.setView([location.lat, location.lng], 12);
    }
  }, [location, map]);
  
  return null;
}

export const ClickableMap = ({ 
  label, 
  value, 
  onChange, 
  defaultCenter = [39.8283, -98.5795],
  defaultZoom = 4 
}) => {
  const [mapKey, setMapKey] = useState(0); // Force re-render when needed

  const handleLocationSelect = (location) => {
    onChange(location);
  };

  const handleClearLocation = () => {
    onChange(null);
    setMapKey(prev => prev + 1); // Force map re-render
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: parseFloat(position.coords.latitude.toFixed(6)),
            lng: parseFloat(position.coords.longitude.toFixed(6))
          };
          handleLocationSelect(location);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Could not get your current location. Please click on the map to select a location.');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  // Determine map center and zoom
  const mapCenter = value ? [value.lat, value.lng] : defaultCenter;
  const mapZoom = value ? 12 : defaultZoom;

  return (
    <div>
      <Instructions>
        📍 Click anywhere on the map to set the {label.toLowerCase()}. The marker will be placed at the clicked location and coordinates will be captured.
      </Instructions>
      
      <MapWrapper>
        <MapContainer
          key={mapKey}
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          <LocationSelector onLocationSelect={handleLocationSelect} />
          <MapController location={value} />
          
          {value && (
            <Marker position={[value.lat, value.lng]} />
          )}
        </MapContainer>
      </MapWrapper>
      
      {value && (
        <LocationInfo>
          <LocationLabel>{label} Selected:</LocationLabel>
          <Coordinates>
            <div><strong>Latitude:</strong> {value.lat}</div>
            <div><strong>Longitude:</strong> {value.lng}</div>
          </Coordinates>
          <ActionButtons>
            <ClearButton onClick={handleClearLocation}>
              🗑️ Clear Selection
            </ClearButton>
            <UseLocationButton onClick={handleUseCurrentLocation}>
              📍 Use Current Location
            </UseLocationButton>
          </ActionButtons>
        </LocationInfo>
      )}
      
      {!value && (
        <ActionButtons>
          <UseLocationButton onClick={handleUseCurrentLocation}>
            📍 Use My Current Location
          </UseLocationButton>
        </ActionButtons>
      )}
    </div>
  );
};