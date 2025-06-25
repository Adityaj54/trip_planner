import React from 'react';
import styled from 'styled-components';

const MapContainer = styled.div`
  height: 400px;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 20px 0;
  position: relative;
  overflow: hidden;
`;

const MapFrame = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 8px;
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

const SegmentList = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
`;

const SegmentTitle = styled.h4`
  margin: 0 0 15px 0;
  color: #333;
`;

const SegmentItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  margin: 5px 0;
  background: white;
  border-radius: 4px;
  border-left: 4px solid ${props => props.$color};
`;

const SegmentIcon = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${props => props.$color};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 15px;
  font-size: 12px;
`;

const SegmentDetails = styled.div`
  flex: 1;
`;

const SegmentType = styled.div`
  font-weight: bold;
  text-transform: capitalize;
  margin-bottom: 2px;
`;

const SegmentMeta = styled.div`
  font-size: 12px;
  color: #666;
`;

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

const getSegmentIcon = (type) => {
  switch (type) {
    case 'drive': return '🚛';
    case 'pickup': return '📦';
    case 'dropoff': return '📍';
    case 'refuel': return '⛽';
    case 'rest': return '😴';
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

export const SimpleRouteMap = ({ trip }) => {
  if (!trip) {
    return <div>No trip data available</div>;
  }

  // Build Google Maps URL with waypoints
  const buildMapUrl = () => {
    const waypoints = [];
    
    // Add current location as origin if available
    if (trip.current_location) {
      waypoints.push(`${trip.current_location.lat},${trip.current_location.lng}`);
    }
    
    // Add pickup location
    if (trip.pickup_location) {
      waypoints.push(`${trip.pickup_location.lat},${trip.pickup_location.lng}`);
    }
    
    // Add dropoff location as destination
    if (trip.dropoff_location) {
      waypoints.push(`${trip.dropoff_location.lat},${trip.dropoff_location.lng}`);
    }
    
    if (waypoints.length < 2) {
      // Fallback to just showing the first available location
      const location = trip.current_location || trip.pickup_location || trip.dropoff_location;
      if (location) {
        return `https://maps.google.com/maps?q=${location.lat},${location.lng}&z=10&output=embed`;
      }
      return 'https://maps.google.com/maps?q=39.8283,-98.5795&z=4&output=embed';
    }
    
    const origin = waypoints[0];
    const destination = waypoints[waypoints.length - 1];
    const waypointStr = waypoints.slice(1, -1).join('|');
    
    let url = `https://maps.google.com/maps?saddr=${origin}&daddr=${destination}`;
    if (waypointStr) {
      url += `&waypoints=${waypointStr}`;
    }
    url += '&output=embed';
    
    return url;
  };

  // Count different segment types
  const segmentCounts = trip.route?.reduce((acc, segment) => {
    acc[segment.type] = (acc[segment.type] || 0) + 1;
    return acc;
  }, {}) || {};

  const totalDriveTime = trip.route?.reduce((total, segment) => {
    return segment.type === 'drive' && segment.duration_minutes 
      ? total + segment.duration_minutes 
      : total;
  }, 0) || 0;

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
          <InfoLabel>Drive Time</InfoLabel>
          <InfoValue>{formatDuration(totalDriveTime)}</InfoValue>
        </InfoCard>
        
        {trip.current_cycle_used_hours !== null && trip.current_cycle_used_hours !== undefined && (
          <InfoCard $color="#dc3545">
            <InfoLabel>Cycle Hours</InfoLabel>
            <InfoValue>{trip.current_cycle_used_hours}/70</InfoValue>
          </InfoCard>
        )}
      </RouteInfo>

      <MapContainer>
        <MapFrame
          src={buildMapUrl()}
          title="Trip Route Map"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </MapContainer>

      {trip.route && trip.route.length > 0 && (
        <SegmentList>
          <SegmentTitle>Route Segments ({trip.route.length} total)</SegmentTitle>
          
          {/* Summary of segment types */}
          <div style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {Object.entries(segmentCounts).map(([type, count]) => (
              <div key={type} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                background: 'white', 
                padding: '5px 10px', 
                borderRadius: '20px',
                fontSize: '12px',
                border: `2px solid ${getSegmentColor(type)}`
              }}>
                <span style={{ marginRight: '5px' }}>{getSegmentIcon(type)}</span>
                <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{type}</span>
                <span style={{ marginLeft: '5px', color: '#666' }}>({count})</span>
              </div>
            ))}
          </div>
          
          {/* Detailed segment list */}
          {trip.route.map((segment, index) => (
            <SegmentItem key={index} $color={getSegmentColor(segment.type)}>
              <SegmentIcon $color={getSegmentColor(segment.type)}>
                {getSegmentIcon(segment.type)}
              </SegmentIcon>
              <SegmentDetails>
                <SegmentType>{segment.type}</SegmentType>
                <SegmentMeta>
                  {segment.distance_km && <span>Distance: {segment.distance_km.toFixed(1)} km • </span>}
                  {segment.duration_minutes && <span>Duration: {formatDuration(segment.duration_minutes)} • </span>}
                  {segment.start_location && <span>From: {formatLocation(segment.start_location)}</span>}
                </SegmentMeta>
              </SegmentDetails>
            </SegmentItem>
          ))}
        </SegmentList>
      )}
    </div>
  );
};