# Loom Video [link](https://www.loom.com/share/109c0391363e476195aaf6d01d730e58?sid=bd026cb9-1ae3-4070-9481-de5a07155b49)

# 🚛 ELD Trip Planner

A full-stack web application that helps property-carrying truck drivers plan their routes with compliance to Hours of Service (HOS) regulations and generates ELD-style log sheets.

## 🎯 Overview

Truck takes location inputs and driver hours, then returns an optimized route with annotated stops and generates comprehensive log sheets for the entire trip, ensuring DOT HOS compliance throughout the journey.

## ✨ Features

- **Route Planning**: Calculate optimal routes from current location → pickup → dropoff
- **HOS Compliance**: Automatic compliance with FMCSA Hours of Service regulations
- **Fuel Management**: Automatic refueling stops every 1000 miles
- **ELD Log Sheets**: Generate realistic ELD-style duty status logs
- **Interactive Maps**: Visual route display with all stops and events
- **Rest Break Calculation**: Mandatory rest periods and breaks

## 🏗️ Architecture

### Frontend (React)
- **Technology**: React.js
- **State Management**: MobX with MobX State Tree
- **Styling**: Styled Components
- **Maps**: React Leaflet for interactive mapping
- **API Client**: Axios for backend communication

### Backend (Django)
- **Framework**: Django REST Framework
- **Database**: SQLite in-memory for development
- **Core Services**: Trip planning, route calculation, HOS compliance
- **API Design**: RESTful endpoints with comprehensive documentation

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+ and pip

### Backend Setup
```bash
cd server
pip install django djangorestframework requests django-cors-headers
python3 manage.py migrate
python3 manage.py runserver 8000
```

### Frontend Setup
```bash
cd client
npm install
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## 📡 API Endpoints

### Base URL: `/api/v1`

### Create Trip Plan
**POST** `/trip-plans/`

```json
{
  "current_location": {"lat": 40.7128, "lng": -74.0060},
  "pickup_location": {"lat": 41.8781, "lng": -87.6298},
  "dropoff_location": {"lat": 34.0522, "lng": -118.2437},
  "current_cycle_used_hours": 20
}
```

### Get Trip Details
**GET** `/trip-plans/{trip_id}/`

### Get Trip Logs
**GET** `/trip-plans/{trip_id}/logs/`

## 🛡️ HOS Compliance Rules

The system enforces FMCSA regulations:

- **11-Hour Driving Limit**: Maximum 11 hours of driving per day
- **10-Hour Rest Requirement**: Mandatory rest after driving window
- **30-Minute Break Rule**: Required break after 8 hours of driving
- **70-Hour Cycle**: Weekly cycle limit enforcement
- **Automatic Fuel Stops**: Every 1000 miles (~1609 km)
- **Loading/Unloading**: 1 hour allocated for pickup/dropoff events

## 🗺️ Route Segment Types

- **Drive**: Driving segments with distance and duration
- **Pickup**: Cargo pickup event (60 minutes)
- **Dropoff**: Cargo delivery event (60 minutes)
- **Refuel**: Refueling stop (30 minutes)
- **Rest**: Mandatory 10-hour rest period
- **Break**: 30-minute compliance break

## 🧪 Testing

### Backend Tests
```bash
cd server
python3 test_api.py
```

### Frontend Tests
```bash
cd client
npm test
```

## 📁 Project Structure

```
lorry/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   ├── stores/         # MobX stores
│   │   └── types/          # TypeScript types
│   └── package.json
├── server/                 # Django backend
│   ├── eld_trip_planner/   # Django project
│   ├── trip_planner/       # Main app
│   │   ├── models.py       # Database models
│   │   ├── services.py     # Business logic
│   │   ├── serializers.py  # API serializers
│   │   └── views.py        # API endpoints
│   └── manage.py
├── ELD_Trip_Planner_Spec.md
└── README.md
```

## 💡 Key Components

### Frontend Components
- **TripPlanForm**: Input form for trip parameters
- **InteractiveMap**: Route visualization with Leaflet
- **ELDLogSheet**: HOS compliance log display
- **RouteVisualization**: Detailed route information

### Backend Models
- **Trip**: Core trip information and metadata
- **RouteSegment**: Individual route segments with type classification
- **LogSheet**: ELD-style duty status logs with compliance data

## 🚀 Deployment

This application is deployed using serverless platforms:

- **Backend API**: Deployed on [Render](https://render.com) 
- **Frontend UI**: Deployed on [Vercel](https://vercel.com)

### Important Notes
- Both services are **serverless** and will go offline during periods of inactivity
- **Cold start time**: ~1 minute when services wake up from sleep
- First request after inactivity may experience longer response times

## 🔧 Development

### Frontend Development
```bash
cd client
npm run lint          # Run ESLint
npm run lint:fix       # Fix linting issues
npm run analyze-build  # Analyze bundle size
```

### Backend Development
```bash
cd server
python3 debug_test.py  # Run debug tests
python3 manage.py shell # Django shell
```

## 📝 License

This project is licensed under the ISC License.

## 📞 Support

For issues and questions, please refer to the project documentation or create an issue in the repository.