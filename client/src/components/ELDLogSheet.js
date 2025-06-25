import React from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  background: white;
  border: 2px solid #000;
  font-family: Arial, sans-serif;
  font-size: 12px;
`;

const Header = styled.div`
  border-bottom: 2px solid #000;
  padding-bottom: 10px;
  margin-bottom: 15px;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 10px 0;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const HeaderSection = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const FieldGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Label = styled.span`
  font-weight: bold;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid #000;
  background: transparent;
  padding: 2px;
  font-size: 12px;
  width: ${props => props.width || '80px'};
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 15px;
`;

const InfoSection = styled.div`
  border: 1px solid #000;
  padding: 8px;
  height: 60px;
`;

const SectionTitle = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
  text-align: center;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 3px;
`;

const DayContainer = styled.div`
  margin-bottom: 30px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
`;

const DayHeader = styled.div`
  background: #007bff;
  color: white;
  padding: 15px;
  font-weight: bold;
  font-size: 18px;
`;

const LogGraph = styled.div`
  padding: 20px;
  background: #f8f9fa;
`;

const LogGrid = styled.div`
  border: 2px solid #000;
  margin-bottom: 15px;
`;

const TimeScale = styled.div`
  display: grid;
  grid-template-columns: 80px repeat(24, 1fr);
  border-bottom: 1px solid #000;
  background: #f0f0f0;
`;

const TimeHeader = styled.div`
  padding: 5px;
  text-align: center;
  font-size: 10px;
  font-weight: bold;
  border-right: 1px solid #000;
`;

const HourMarker = styled.div`
  padding: 5px 2px;
  text-align: center;
  font-size: 8px;
  border-right: 1px solid #ccc;
  background: linear-gradient(to right, transparent 0%, transparent 45%, #000 45%, #000 55%, transparent 55%);
  &:nth-child(even) {
    background: linear-gradient(to right, transparent 0%, transparent 45%, #000 45%, #000 55%, transparent 55%), #f8f8f8;
  }
`;

const StatusRow = styled.div`
  display: grid;
  grid-template-columns: 80px repeat(24, 1fr);
  border-bottom: 1px solid #000;
  min-height: 25px;
`;

const StatusLabel = styled.div`
  padding: 5px;
  font-weight: bold;
  font-size: 11px;
  border-right: 1px solid #000;
  background: #f0f0f0;
  display: flex;
  align-items: center;
`;

const StatusCell = styled.div`
  border-right: 1px solid #ccc;
  background: white;
  position: relative;
  height: 25px;
  
  &.active {
    background: #000;
  }
  
  &:hover {
    background: #e0e0e0;
    cursor: pointer;
  }
`;

const DiagonalLine = styled.div`
  position: absolute;
  height: 2px;
  background: #000;
  transform-origin: left center;
  top: 50%;
  left: 0;
  z-index: 10;
  box-shadow: 0 1px 1px rgba(0,0,0,0.3);
`;

const AnnotationText = styled.div`
  position: absolute;
  font-size: 10px;
  font-weight: bold;
  color: #000;
  white-space: nowrap;
  transform: rotate(-10deg);
  transform-origin: left center;
  top: -2px;
  left: 4px;
  z-index: 11;
  pointer-events: none;
  text-shadow: 1px 1px 2px rgba(255,255,255,0.8);
  background: rgba(255,255,255,0.7);
  padding: 1px 2px;
  border-radius: 2px;
  font-family: 'Arial', sans-serif;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  padding: 20px;
  background: white;
`;

const SummaryCard = styled.div`
  text-align: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #007bff;
`;

const SummaryLabel = styled.div`
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  font-weight: bold;
  margin-bottom: 5px;
`;

const SummaryValue = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #333;
`;

const RemarksSection = styled.div`
  border: 1px solid #000;
  margin-bottom: 15px;
  padding: 10px;
  min-height: 80px;
`;

const SectionHeader = styled.h3`
  margin: 0 0 10px 0;
  font-size: 14px;
  font-weight: bold;
`;

const ShippingSection = styled.div`
  border: 1px solid #000;
  margin-bottom: 15px;
  padding: 10px;
  min-height: 100px;
`;

const ShippingGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-top: 10px;
`;

const ShippingField = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
`;

const SummaryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #000;
  font-size: 10px;
`;

const SummaryTableHeader = styled.th`
  background: #f0f0f0;
  border: 1px solid #000;
  padding: 5px;
  text-align: center;
  font-weight: bold;
`;

const SummaryTableCell = styled.td`
  border: 1px solid #000;
  padding: 5px;
  text-align: center;
`;

const TextArea = styled.textarea`
  width: 100%;
  border: none;
  background: transparent;
  resize: vertical;
  font-family: inherit;
  font-size: 12px;
  min-height: 60px;
`;

const generateTimeSlots = (graphPoints) => {
  const slots = new Array(24).fill('off-duty');
  
  for (let i = 0; i < graphPoints.length - 1; i++) {
    const current = graphPoints[i];
    const next = graphPoints[i + 1];
    
    const startHour = parseInt(current.time.split(':')[0]);
    const endHour = parseInt(next.time.split(':')[0]);
    
    for (let hour = startHour; hour < endHour; hour++) {
      if (hour >= 0 && hour < 24) {
        slots[hour] = current.status;
      }
    }
  }
  
  return slots;
};

const generateStatusTransitions = (graphPoints, statusKey) => {
  const transitions = [];
  
  for (let i = 0; i < graphPoints.length - 1; i++) {
    const current = graphPoints[i];
    const next = graphPoints[i + 1];
    
    // Check if this transition involves the current status
    if (current.status === statusKey || next.status === statusKey) {
      const startHour = parseInt(current.time.split(':')[0]);
      const startMinute = parseInt(current.time.split(':')[1]);
      const endHour = parseInt(next.time.split(':')[0]);
      const endMinute = parseInt(next.time.split(':')[1]);
      
      const startPosition = startHour + (startMinute / 60);
      const endPosition = endHour + (endMinute / 60);
      
      if (current.status === statusKey) {
        transitions.push({
          startHour: startPosition,
          endHour: endPosition,
          annotation: current.annotation,
          location: current.location
        });
      }
    }
  }
  
  return transitions;
};

const formatHours = (hours) => {
  return `${hours.toFixed(1)}h`;
};

export const ELDLogSheet = observer(({ logs }) => {
  // ELD status types including mandatory break and rest periods
  const statusTypes = [
    { id: 1, label: 'Off Duty', key: 'off-duty' },
    { id: 2, label: 'Sleeper', key: 'sleeper' },
    { id: 3, label: 'Driving', key: 'driving' },
    { id: 4, label: 'On-Duty', key: 'on-duty' },
    { id: 5, label: 'Break', key: 'break' },
    { id: 6, label: 'Rest', key: 'rest' }
  ];

  const currentDate = new Date();
  
  return (
    <Container>
      <Header>
        <Title>Drivers Daily Log</Title>
        
        <HeaderRow>
          <HeaderSection>
            <FieldGroup>
              <Label>Date (Month/Day/Year):</Label>
              <Input width="100px" defaultValue={currentDate.toLocaleDateString()} />
            </FieldGroup>
          </HeaderSection>
          <HeaderSection>
            <FieldGroup>
              <Label>Original - File at home terminal</Label>
            </FieldGroup>
          </HeaderSection>
        </HeaderRow>
        
        <HeaderRow>
          <HeaderSection>
            <FieldGroup>
              <Label>Name:</Label>
              <Input width="200px" />
            </FieldGroup>
          </HeaderSection>
          <HeaderSection>
            <FieldGroup>
              <Label>Duplicate - Driver retains for specified time.</Label>
            </FieldGroup>
          </HeaderSection>
        </HeaderRow>
        
        <HeaderRow>
          <HeaderSection>
            <FieldGroup>
              <Label>From:</Label>
              <Input width="150px" />
            </FieldGroup>
            <FieldGroup>
              <Label>To:</Label>
              <Input width="150px" />
            </FieldGroup>
          </HeaderSection>
          <HeaderSection>
            <FieldGroup>
              <Label>Duplicate - Submit within 10 days to motor</Label>
            </FieldGroup>
          </HeaderSection>
        </HeaderRow>
      </Header>

      <InfoGrid>
        <InfoSection>
          <SectionTitle>Total Miles Driving Today</SectionTitle>
          <InfoRow>
            <span>Total Mileage Today:</span>
            <Input width="60px" />
          </InfoRow>
        </InfoSection>
        
        <InfoSection>
          <SectionTitle>Name of Co-Driver</SectionTitle>
          <InfoRow>
            <span>Main Office Address:</span>
          </InfoRow>
          <InfoRow>
            <span>Home Terminal Address:</span>
          </InfoRow>
        </InfoSection>
      </InfoGrid>

      <InfoGrid>
        <InfoSection>
          <SectionTitle>Truck/Tractor and Trailer Number or License Plate/State (Show each unit)</SectionTitle>
          <Input width="100%" />
        </InfoSection>
        
        <InfoSection>
          <SectionTitle>Home Terminal Address</SectionTitle>
          <Input width="100%" />
        </InfoSection>
      </InfoGrid>

      {logs && logs.logs && logs.logs.map(dayLog => {
        const timeSlots = generateTimeSlots(dayLog.graph_points || []);
        
        return (
          <DayContainer key={dayLog.day}>
            <DayHeader>Day {dayLog.day}</DayHeader>
            
            <LogGraph>
              <LogGrid>
                <TimeScale>
                  <TimeHeader>Hour</TimeHeader>
                  {Array.from({ length: 24 }, (_, i) => (
                    <HourMarker key={i}>
                      {i}
                    </HourMarker>
                  ))}
                </TimeScale>
                
                {statusTypes.map(status => {
                  const transitions = generateStatusTransitions(dayLog.graph_points || [], status.key);
                  
                  return (
                    <StatusRow key={status.id}>
                      <StatusLabel>{status.id}. {status.label}</StatusLabel>
                      {timeSlots.map((slot, hour) => (
                        <StatusCell 
                          key={hour} 
                          className={slot === status.key ? 'active' : ''}
                        >
                          {transitions.map((transition, idx) => {
                            const cellStart = hour;
                            const cellEnd = hour + 1;
                            
                            // Check if this transition overlaps with this cell
                            if (transition.startHour < cellEnd && transition.endHour > cellStart) {
                              const overlapStart = Math.max(transition.startHour, cellStart);
                              const overlapEnd = Math.min(transition.endHour, cellEnd);
                              const overlapWidth = ((overlapEnd - overlapStart) / 1) * 100;
                              const offsetLeft = ((overlapStart - cellStart) / 1) * 100;
                              
                              // Only show annotation if this is the start of the transition and width is substantial
                              const showAnnotation = transition.annotation && 
                                                    Math.abs(overlapStart - transition.startHour) < 0.1 && 
                                                    overlapWidth > 20;
                              
                              return (
                                <div key={idx}>
                                  <DiagonalLine
                                    style={{
                                      width: `${overlapWidth}%`,
                                      left: `${offsetLeft}%`,
                                      transform: `rotate(${transition.startHour < transition.endHour ? '10deg' : '-10deg'})`
                                    }}
                                  />
                                  {showAnnotation && (
                                    <AnnotationText
                                      style={{
                                        left: `${offsetLeft + 2}%`
                                      }}
                                    >
                                      {transition.annotation.length > 15 ? 
                                        transition.annotation.substring(0, 12) + '...' : 
                                        transition.annotation}
                                    </AnnotationText>
                                  )}
                                </div>
                              );
                            }
                            return null;
                          })}
                        </StatusCell>
                      ))}
                    </StatusRow>
                  );
                })}
              </LogGrid>
              
              <SummaryGrid>
                <SummaryCard>
                  <SummaryLabel>Driving Hours</SummaryLabel>
                  <SummaryValue>{formatHours(dayLog.summary?.driving_hours || 0)}</SummaryValue>
                </SummaryCard>
                <SummaryCard>
                  <SummaryLabel>On-Duty Hours</SummaryLabel>
                  <SummaryValue>{formatHours(dayLog.summary?.on_duty_hours || 0)}</SummaryValue>
                </SummaryCard>
                <SummaryCard>
                  <SummaryLabel>Rest Hours</SummaryLabel>
                  <SummaryValue>{formatHours(dayLog.summary?.rest_hours || 0)}</SummaryValue>
                </SummaryCard>
              </SummaryGrid>
            </LogGraph>
          </DayContainer>
        );
      })}

      <RemarksSection>
        <SectionHeader>Remarks</SectionHeader>
        <TextArea placeholder="Enter any remarks or notes here..." />
      </RemarksSection>

      <ShippingSection>
        <SectionHeader>Shipping Documents:</SectionHeader>
        <ShippingGrid>
          <div>
            <ShippingField>
              <Label>Bill of Lading No.:</Label>
              <Input width="120px" />
            </ShippingField>
            <ShippingField>
              <Label>Shipper & Commodity:</Label>
              <Input width="150px" />
            </ShippingField>
          </div>
          <div>
            <Label>Enter name of place you reported and where relieved from work and where each change of duty occurred:</Label>
          </div>
        </ShippingGrid>
      </ShippingSection>

      <SummaryTable>
        <thead>
          <tr>
            <SummaryTableHeader rowSpan="2">Recap</SummaryTableHeader>
            <SummaryTableHeader colSpan="2">(1) Hours</SummaryTableHeader>
            <SummaryTableHeader colSpan="2">(2) Hours</SummaryTableHeader>
            <SummaryTableHeader rowSpan="2">For each day show consecutive hours</SummaryTableHeader>
          </tr>
          <tr>
            <SummaryTableHeader>Off Duty</SummaryTableHeader>
            <SummaryTableHeader>A. Total</SummaryTableHeader>
            <SummaryTableHeader>B. Total</SummaryTableHeader>
            <SummaryTableHeader>C. Total</SummaryTableHeader>
          </tr>
        </thead>
        <tbody>
          <tr>
            <SummaryTableCell>Line 1</SummaryTableCell>
            <SummaryTableCell></SummaryTableCell>
            <SummaryTableCell></SummaryTableCell>
            <SummaryTableCell></SummaryTableCell>
            <SummaryTableCell></SummaryTableCell>
            <SummaryTableCell></SummaryTableCell>
          </tr>
          <tr>
            <SummaryTableCell>Hours 0-8</SummaryTableCell>
            <SummaryTableCell></SummaryTableCell>
            <SummaryTableCell></SummaryTableCell>
            <SummaryTableCell></SummaryTableCell>
            <SummaryTableCell></SummaryTableCell>
            <SummaryTableCell></SummaryTableCell>
          </tr>
          <tr>
            <SummaryTableCell>Total Hours</SummaryTableCell>
            <SummaryTableCell>24</SummaryTableCell>
            <SummaryTableCell></SummaryTableCell>
            <SummaryTableCell></SummaryTableCell>
            <SummaryTableCell></SummaryTableCell>
            <SummaryTableCell></SummaryTableCell>
          </tr>
        </tbody>
      </SummaryTable>
    </Container>
  );
});