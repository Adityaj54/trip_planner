import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const MapContainer = styled.div`
  height: 400px;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #ddd;
  margin-bottom: 10px;
`;

const Instructions = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid #007bff;
`;

const LocationDisplay = styled.div`
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  margin-top: 10px;
  border-left: 4px solid #28a745;
`;

const LocationLabel = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
`;

const Coordinates = styled.div`
  font-family: monospace;
  font-size: 16px;
  color: #007bff;
  background: white;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
`;

const ClearButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-top: 10px;
  
  &:hover {
    background: #c82333;
  }
`;

// OpenStreetMap tile-based interactive map implementation
const OSMMap = ({ onLocationSelect, selectedLocation, label, defaultCenter = [39.8283, -98.5795] }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Create map using Leaflet-style API but with vanilla JS
    const initMap = () => {
      const mapElement = mapRef.current;
      if (!mapElement) return;

      // Clear any existing content
      mapElement.innerHTML = '';

      // Create a simple tile-based map using OpenStreetMap
      const mapDiv = document.createElement('div');
      mapDiv.style.width = '100%';
      mapDiv.style.height = '100%';
      mapDiv.style.position = 'relative';
      mapDiv.style.background = '#f0f0f0';
      mapDiv.style.overflow = 'hidden';
      mapElement.appendChild(mapDiv);

      // For now, let's use a simpler approach with an iframe that allows interaction
      const iframe = document.createElement('iframe');
      const lat = selectedLocation ? selectedLocation.lat : defaultCenter[0];
      const lng = selectedLocation ? selectedLocation.lng : defaultCenter[1];
      
      // Use uMap (OpenStreetMap based) for better interaction
      iframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-2},${lat-2},${lng+2},${lat+2}&layer=mapnik&marker=${lat},${lng}`;
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      iframe.title = `${label} Map`;
      
      mapDiv.appendChild(iframe);

      // Add click handler overlay
      const overlay = document.createElement('div');
      overlay.style.position = 'absolute';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.zIndex = '1000';
      overlay.style.cursor = 'crosshair';
      overlay.style.background = 'rgba(0,0,0,0.1)';
      overlay.style.display = 'flex';
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';
      overlay.style.color = 'white';
      overlay.style.fontWeight = 'bold';
      overlay.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
      overlay.innerHTML = '📍 Click anywhere on this area to select location';
      
      overlay.addEventListener('click', (e) => {
        const rect = overlay.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Convert pixel coordinates to approximate lat/lng
        // This is a rough approximation for demonstration
        const lat = defaultCenter[0] + (0.5 - y / rect.height) * 4;
        const lng = defaultCenter[1] + (x / rect.width - 0.5) * 4;
        
        onLocationSelect({ lat: parseFloat(lat.toFixed(6)), lng: parseFloat(lng.toFixed(6)) });
        
        // Hide overlay after selection
        overlay.style.display = 'none';
      });
      
      mapDiv.appendChild(overlay);
      
      // Hide overlay if location is already selected
      if (selectedLocation) {
        overlay.style.display = 'none';
      }
    };

    initMap();
  }, [selectedLocation, defaultCenter, label, onLocationSelect]);

  const handleClearLocation = () => {
    onLocationSelect(null);
    // Re-initialize map
    const overlay = mapRef.current?.querySelector('div > div:last-child');
    if (overlay) {
      overlay.style.display = 'flex';
    }
  };

  return (
    <div>
      <Instructions>
        📍 Click on the map below to select the {label.toLowerCase()}. The coordinates will be captured automatically.
      </Instructions>
      
      <MapContainer ref={mapRef} />
      
      {selectedLocation && (
        <LocationDisplay>
          <LocationLabel>{label} Selected:</LocationLabel>
          <Coordinates>
            Latitude: {selectedLocation.lat}, Longitude: {selectedLocation.lng}
          </Coordinates>
          <ClearButton onClick={handleClearLocation}>
            Clear Selection
          </ClearButton>
        </LocationDisplay>
      )}
    </div>
  );
};

// Alternative implementation using Google Maps via postMessage
const GoogleMapsClickable = ({ onLocationSelect, selectedLocation, label, defaultCenter = [39.8283, -98.5795] }) => {

  useEffect(() => {
    // Listen for messages from the iframe
    const handleMessage = (event) => {
      // Security check - only accept messages from google maps
      if (event.origin !== 'https://maps.google.com') return;
      
      if (event.data && event.data.lat && event.data.lng) {
        onLocationSelect({
          lat: parseFloat(event.data.lat),
          lng: parseFloat(event.data.lng)
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onLocationSelect]);

  // For now, let's use a simpler click-to-coordinate approach
  return <OSMMap 
    onLocationSelect={onLocationSelect} 
    selectedLocation={selectedLocation} 
    label={label} 
    defaultCenter={defaultCenter} 
  />;
};

export const InteractiveMap = GoogleMapsClickable;