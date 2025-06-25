import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styled from 'styled-components';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapWrapper = styled.div`
  height: 500px;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #ddd;
  margin: 20px 0;
`;

const RouteInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`;

const InfoCard = styled.div`
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid ${props => props.$color || '#007bff'};
`;

const InfoLabel = styled.div`
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  font-weight: bold;
  margin-bottom: 5px;
`;

const InfoValue = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

const PopupContent = styled.div`
  min-width: 150px;
`;

const PopupTitle = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
  text-transform: capitalize;
  color: #333;
`;

const PopupDetails = styled.div`
  font-size: 12px;
  color: #666;
  line-height: 1.4;
`;

// Create custom icons for different segment types
const createCustomIcon = (color, symbol) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="
      background-color: ${color};
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: white;
      font-weight: bold;
    ">${symbol}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};

const getSegmentColor = (type) => {
  switch (type) {
    case 'drive': return '#28a745';
    case 'pickup': return '#ffc107';
    case 'dropoff': return '#dc3545';
    case 'refuel': return '#17a2b8';
    case 'rest': return '#6f42c1';
    case 'break': return '#fd7e14';
    default: return '#6c757d';
  }
};

const getSegmentSymbol = (type) => {
  switch (type) {
    case 'drive': return '🚛';
    case 'pickup': return '📦';
    case 'dropoff': return '📍';
    case 'refuel': return '⛽';
    case 'rest': return '💤';
    case 'break': return '☕';
    default: return '📌';
  }
};

const formatDuration = (minutes) => {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

const formatLocation = (location) => {
  if (!location) return 'N/A';
  return `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
};

export const RouteVisualization = ({ trip }) => {
  if (!trip) {
    return <div>No trip data available</div>;
  }

  // Extract all locations for bounds calculation
  const allLocations = [];
  
  // Add main trip locations
  if (trip.current_location) {
    allLocations.push([trip.current_location.lat, trip.current_location.lng]);
  }
  if (trip.pickup_location) {
    allLocations.push([trip.pickup_location.lat, trip.pickup_location.lng]);
  }
  if (trip.dropoff_location) {
    allLocations.push([trip.dropoff_location.lat, trip.dropoff_location.lng]);
  }
  
  // Add route segment locations
  if (trip.route) {
    trip.route.forEach(segment => {
      if (segment.start_location) {
        allLocations.push([segment.start_location.lat, segment.start_location.lng]);
      }
      if (segment.end_location) {
        allLocations.push([segment.end_location.lat, segment.end_location.lng]);
      }
    });
  }

  // Calculate map center
  const center = allLocations.length > 0 ? allLocations[0] : [39.8283, -98.5795];
  
  // Create route lines for driving segments
  const routeLines = trip.route ? trip.route
    .filter(segment => segment.type === 'drive' && segment.start_location && segment.end_location)
    .map((segment, index) => ({
      positions: [
        [segment.start_location.lat, segment.start_location.lng],
        [segment.end_location.lat, segment.end_location.lng]
      ],
      color: getSegmentColor(segment.type),
      key: `route-${index}`
    })) : [];

  // Calculate statistics
  const totalDriveTime = trip.route?.reduce((total, segment) => {
    return segment.type === 'drive' && segment.duration_minutes 
      ? total + segment.duration_minutes 
      : total;
  }, 0) || 0;

  const segmentCounts = trip.route?.reduce((acc, segment) => {
    acc[segment.type] = (acc[segment.type] || 0) + 1;
    return acc;
  }, {}) || {};

  return (
    <div>
      <RouteInfo>
        <InfoCard $color="#007bff">
          <InfoLabel>Total Distance</InfoLabel>
          <InfoValue>{trip.total_distance_km?.toFixed(1) || 'N/A'} km</InfoValue>
        </InfoCard>
        
        <InfoCard $color="#28a745">
          <InfoLabel>Estimated Days</InfoLabel>
          <InfoValue>{trip.estimated_days || 'N/A'}</InfoValue>
        </InfoCard>
        
        <InfoCard $color="#ffc107">
          <InfoLabel>Total Drive Time</InfoLabel>
          <InfoValue>{formatDuration(totalDriveTime)}</InfoValue>
        </InfoCard>
        
        {trip.current_cycle_used_hours !== null && trip.current_cycle_used_hours !== undefined && (
          <InfoCard $color="#dc3545">
            <InfoLabel>Cycle Hours Used</InfoLabel>
            <InfoValue>{trip.current_cycle_used_hours}/70</InfoValue>
          </InfoCard>
        )}
      </RouteInfo>

      <MapWrapper>
        <MapContainer
          center={center}
          zoom={allLocations.length > 1 ? 6 : 4}
          style={{ height: '100%', width: '100%' }}
          bounds={allLocations.length > 1 ? allLocations : undefined}
          boundsOptions={{ padding: [20, 20] }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Draw route lines */}
          {routeLines.map(line => (
            <Polyline
              key={line.key}
              positions={line.positions}
              color={line.color}
              weight={5}
              opacity={0.8}
            />
          ))}
          
          {/* Add markers for main locations */}
          {trip.current_location && (
            <Marker 
              position={[trip.current_location.lat, trip.current_location.lng]}
              icon={createCustomIcon('#007bff', '🚛')}
            >
              <Popup>
                <PopupContent>
                  <PopupTitle>Current Location</PopupTitle>
                  <PopupDetails>
                    Starting point of the trip<br/>
                    {formatLocation(trip.current_location)}
                  </PopupDetails>
                </PopupContent>
              </Popup>
            </Marker>
          )}
          
          {trip.pickup_location && (
            <Marker 
              position={[trip.pickup_location.lat, trip.pickup_location.lng]}
              icon={createCustomIcon('#ffc107', '📦')}
            >
              <Popup>
                <PopupContent>
                  <PopupTitle>Pickup Location</PopupTitle>
                  <PopupDetails>
                    Load pickup point<br/>
                    {formatLocation(trip.pickup_location)}
                  </PopupDetails>
                </PopupContent>
              </Popup>
            </Marker>
          )}
          
          {trip.dropoff_location && (
            <Marker 
              position={[trip.dropoff_location.lat, trip.dropoff_location.lng]}
              icon={createCustomIcon('#dc3545', '📍')}
            >
              <Popup>
                <PopupContent>
                  <PopupTitle>Drop-off Location</PopupTitle>
                  <PopupDetails>
                    Final destination<br/>
                    {formatLocation(trip.dropoff_location)}
                  </PopupDetails>
                </PopupContent>
              </Popup>
            </Marker>
          )}
          
          {/* Add markers for route segments */}
          {trip.route && trip.route.map((segment, index) => {
            // Skip drive segments but show all others including rest and break
            if (!segment.start_location || segment.type === 'drive') {
              console.log(`Skipping segment ${index}: ${segment.type}, has location: ${!!segment.start_location}`);
              return null;
            }
            
            console.log(`Rendering marker for segment ${index}: ${segment.type} at`, segment.start_location);
            
            return (
              <Marker
                key={`segment-${index}`}
                position={[segment.start_location.lat, segment.start_location.lng]}
                icon={createCustomIcon(getSegmentColor(segment.type), getSegmentSymbol(segment.type))}
              >
                <Popup>
                  <PopupContent>
                    <PopupTitle>{segment.type}</PopupTitle>
                    <PopupDetails>
                      {segment.distance_km && <div>Distance: {segment.distance_km.toFixed(1)} km</div>}
                      {segment.duration_minutes && <div>Duration: {formatDuration(segment.duration_minutes)}</div>}
                      <div>Location: {formatLocation(segment.start_location)}</div>
                    </PopupDetails>
                  </PopupContent>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </MapWrapper>

      {/* Route segments summary */}
      {Object.keys(segmentCounts).length > 0 && (
        <RouteInfo>
          {Object.entries(segmentCounts).map(([type, count]) => (
            <InfoCard key={type} $color={getSegmentColor(type)}>
              <InfoLabel>{type} segments</InfoLabel>
              <InfoValue>{getSegmentSymbol(type)} {count}</InfoValue>
            </InfoCard>
          ))}
        </RouteInfo>
      )}
    </div>
  );
};