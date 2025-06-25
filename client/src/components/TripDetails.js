import React from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { RouteVisualization } from './RouteVisualization';

const Container = styled.div`
  max-width: 1000px;
  margin: 20px auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 20px;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const InfoCard = styled.div`
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #007bff;
`;

const InfoLabel = styled.div`
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  font-weight: bold;
  margin-bottom: 5px;
`;

const InfoValue = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;

const RouteSection = styled.div`
  margin-top: 30px;
`;

const RouteTitle = styled.h3`
  color: #333;
  margin-bottom: 15px;
`;

const RouteSegmentCard = styled.div`
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 6px;
  border-left: 4px solid ${props => {
    switch (props.$segmentType) {
      case 'drive': return '#28a745';
      case 'pickup': return '#ffc107';
      case 'dropoff': return '#dc3545';
      case 'refuel': return '#17a2b8';
      case 'rest': return '#6f42c1';
      case 'break': return '#fd7e14';
      default: return '#6c757d';
    }
  }};
  background: ${props => {
    switch (props.$segmentType) {
      case 'drive': return '#d4edda';
      case 'pickup': return '#fff3cd';
      case 'dropoff': return '#f8d7da';
      case 'refuel': return '#d1ecf1';
      case 'rest': return '#e2d9f3';
      case 'break': return '#ffeaa7';
      default: return '#f8f9fa';
    }
  }};
`;

const SegmentType = styled.span`
  font-weight: bold;
  text-transform: capitalize;
  font-size: 14px;
`;

const SegmentDetails = styled.div`
  margin-top: 8px;
  font-size: 13px;
  color: #666;
`;

const LocationText = styled.span`
  font-family: monospace;
  background: rgba(0,0,0,0.1);
  padding: 2px 4px;
  border-radius: 3px;
`;

const formatLocation = (location) => {
  return `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
};

const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

export const TripDetails = observer(({ trip }) => {
  return (
    <Container>
      <Title>Trip Details</Title>
      
      <InfoGrid>
        <InfoCard>
          <InfoLabel>Trip ID</InfoLabel>
          <InfoValue>{trip.trip_id.slice(0, 8)}...</InfoValue>
        </InfoCard>
        
        <InfoCard>
          <InfoLabel>Total Distance</InfoLabel>
          <InfoValue>{trip.total_distance_km.toFixed(1)} km</InfoValue>
        </InfoCard>
        
        <InfoCard>
          <InfoLabel>Estimated Days</InfoLabel>
          <InfoValue>{trip.estimated_days}</InfoValue>
        </InfoCard>
        
        {trip.current_cycle_used_hours !== null && trip.current_cycle_used_hours !== undefined && (
          <InfoCard>
            <InfoLabel>Cycle Hours Used</InfoLabel>
            <InfoValue>{trip.current_cycle_used_hours}/70</InfoValue>
          </InfoCard>
        )}
      </InfoGrid>

      <InfoGrid>
        {trip.current_location && (
          <InfoCard>
            <InfoLabel>Current Location</InfoLabel>
            <InfoValue>
              <LocationText>{formatLocation(trip.current_location)}</LocationText>
            </InfoValue>
          </InfoCard>
        )}
        
        {trip.pickup_location && (
          <InfoCard>
            <InfoLabel>Pickup Location</InfoLabel>
            <InfoValue>
              <LocationText>{formatLocation(trip.pickup_location)}</LocationText>
            </InfoValue>
          </InfoCard>
        )}
        
        {trip.dropoff_location && (
          <InfoCard>
            <InfoLabel>Drop-off Location</InfoLabel>
            <InfoValue>
              <LocationText>{formatLocation(trip.dropoff_location)}</LocationText>
            </InfoValue>
          </InfoCard>
        )}
      </InfoGrid>

      {/* Route Visualization */}
      <RouteVisualization trip={trip} />

      {trip.route && trip.route.length > 0 && (
        <RouteSection>
          <RouteTitle>Route Segments</RouteTitle>
          {trip.route.map((segment, index) => (
            <RouteSegmentCard key={index} $segmentType={segment.type}>
              <SegmentType>{segment.type}</SegmentType>
              <SegmentDetails>
                {segment.start_location && (
                  <div>From: <LocationText>{formatLocation(segment.start_location)}</LocationText></div>
                )}
                {segment.end_location && (
                  <div>To: <LocationText>{formatLocation(segment.end_location)}</LocationText></div>
                )}
                {segment.distance_km && (
                  <div>Distance: {segment.distance_km.toFixed(1)} km</div>
                )}
                {segment.duration_minutes && (
                  <div>Duration: {formatDuration(segment.duration_minutes)}</div>
                )}
              </SegmentDetails>
            </RouteSegmentCard>
          ))}
        </RouteSection>
      )}
    </Container>
  );
});