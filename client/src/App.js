import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { tripStore } from './stores';
import { TripPlanForm } from './components/TripPlanForm';
import { TripDetails } from './components/TripDetails';
import { ELDLogSheet } from './components/ELDLogSheet';

const AppContainer = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: #333;
  font-size: 2.5em;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1.2em;
  margin: 0;
`;

const Navigation = styled.nav`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
`;

const NavButton = styled.button`
  padding: 10px 20px;
  background: ${props => props.$active ? '#007bff' : 'white'};
  color: ${props => props.$active ? 'white' : '#007bff'};
  border: 2px solid #007bff;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  
  &:hover {
    background: #007bff;
    color: white;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 18px;
  color: #666;
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 15px;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  margin: 20px auto;
  max-width: 600px;
  text-align: center;
`;

const App = observer(() => {
  const [activeTab, setActiveTab] = useState('form');

  const handleViewLogs = async () => {
    if (tripStore.currentTrip && !tripStore.currentTripLogs) {
      try {
        await tripStore.loadTripLogs(tripStore.currentTrip.trip_id);
        setActiveTab('logs');
      } catch (error) {
        console.error('Failed to load logs:', error);
      }
    } else {
      setActiveTab('logs');
    }
  };

  return (
    <AppContainer>
      <Header>
        <Title>ELD Trip Planner</Title>
        <Subtitle>Plan truck routes with HOS compliance</Subtitle>
      </Header>

      <Navigation>
        <NavButton
          $active={activeTab === 'form'}
          onClick={() => setActiveTab('form')}
        >
          Plan Trip
        </NavButton>
        
        <NavButton
          $active={activeTab === 'details'}
          onClick={() => setActiveTab('details')}
          disabled={!tripStore.currentTrip}
        >
          Trip Details
        </NavButton>
        
        <NavButton
          $active={activeTab === 'logs'}
          onClick={handleViewLogs}
          disabled={!tripStore.currentTrip}
        >
          ELD Logs
        </NavButton>
      </Navigation>

      {tripStore.loading && (
        <LoadingSpinner>
          Loading...
        </LoadingSpinner>
      )}

      {tripStore.error && (
        <ErrorMessage>
          {tripStore.error}
        </ErrorMessage>
      )}

      {!tripStore.loading && (
        <>
          {activeTab === 'form' && <TripPlanForm onTripCreated={() => setActiveTab('details')} />}
          
          {activeTab === 'details' && tripStore.currentTrip && (
            <TripDetails trip={tripStore.currentTrip} />
          )}
          
          {activeTab === 'logs' && tripStore.currentTripLogs && (
            <ELDLogSheet logs={tripStore.currentTripLogs} />
          )}
        </>
      )}
    </AppContainer>
  );
});

export default App;