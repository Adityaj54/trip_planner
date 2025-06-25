# ELD Trip Planner Backend

A Django REST API backend for the ELD Trip Planner application that helps truck drivers plan routes with HOS (Hours of Service) compliance.

## Features

- Trip planning with HOS compliance logic
- Route calculation with refueling stops every 1000 miles
- ELD-style log sheet generation
- Simple REST API following the specification

## API Endpoints

### Base URL: `http://localhost:8000/api/v1`

### 1. Create Trip Plan
**POST** `/trip-plans/`

**Request Body:**
```json
{
    "current_location": {"lat": 40.7128, "lng": -74.0060},
    "pickup_location": {"lat": 41.8781, "lng": -87.6298},
    "dropoff_location": {"lat": 34.0522, "lng": -118.2437},
    "current_cycle_used_hours": 20
}
```

**Response (201):**
```json
{
    "trip_id": "uuid",
    "total_distance_km": 3948.26,
    "estimated_days": 3,
    "route": [
        {
            "type": "drive",
            "start_location": {"lat": 40.7128, "lng": -74.006},
            "end_location": {"lat": 41.8781, "lng": -87.6298},
            "distance_km": 1144.29,
            "duration_minutes": 686
        },
        {
            "type": "pickup",
            "start_location": {"lat": 41.8781, "lng": -87.6298},
            "end_location": {"lat": 41.8781, "lng": -87.6298},
            "duration_minutes": 60
        }
    ]
}
```

### 2. Get Trip Details
**GET** `/trip-plans/{trip_id}/`

**Response (200):**
```json
{
    "trip_id": "uuid",
    "created_at": "2025-06-23T06:05:40.075322Z",
    "current_location": {"lat": 40.7128, "lng": -74.006},
    "pickup_location": {"lat": 41.8781, "lng": -87.6298},
    "dropoff_location": {"lat": 34.0522, "lng": -118.2437},
    "current_cycle_used_hours": 20,
    "total_distance_km": 3948.26,
    "estimated_days": 3
}
```

### 3. Get Trip Logs
**GET** `/trip-plans/{trip_id}/logs/`

**Response (200):**
```json
{
    "trip_id": "uuid",
    "logs": [
        {
            "day_number": 1,
            "graph_points": [
                {"time": "06:00", "status": "off-duty"},
                {"time": "08:00", "status": "driving"},
                {"time": "12:00", "status": "break"},
                {"time": "12:30", "status": "driving"},
                {"time": "18:00", "status": "off-duty"}
            ],
            "summary": {
                "driving_hours": 39.45,
                "on_duty_hours": 41.95,
                "rest_hours": -17.95
            }
        }
    ]
}
```

## HOS Compliance Rules

The system implements the following FMCSA HOS rules:

- Maximum 11 hours driving per day
- 10 hours rest after driving window
- 30-minute break after 8 hours of driving
- 70-hour/8-day rolling cycle
- Mandatory refueling stops every 1000 miles (~1609 km)
- Pickup/Dropoff events (1 hour each)

## Route Segment Types

- `drive`: Driving segments with distance and duration
- `pickup`: Pickup event (60 minutes)
- `dropoff`: Dropoff event (60 minutes)
- `refuel`: Refueling stop (30 minutes)
- `rest`: Mandatory 10-hour rest period
- `break`: 30-minute break

## Setup and Running

1. Install dependencies:
```bash
pip install django djangorestframework requests django-cors-headers
```

2. Run migrations:
```bash
python3 manage.py migrate
```

3. Start the development server:
```bash
python3 manage.py runserver 8000
```

4. Test the API:
```bash
python3 test_api.py
```

## Project Structure

```
eld_trip_planner/
├── eld_trip_planner/          # Django project settings
│   ├── settings.py
│   └── urls.py
├── trip_planner/              # Main Django app
│   ├── models.py             # Trip, RouteSegment, LogSheet models
│   ├── services.py           # Business logic and HOS compliance
│   ├── serializers.py        # API serializers
│   ├── views.py             # API endpoints
│   └── urls.py              # URL routing
├── manage.py
├── test_api.py              # API test script
└── debug_test.py            # Debug test script
```

## Models

### Trip
- UUID primary key
- Current, pickup, and dropoff locations (JSON)
- Current cycle used hours
- Total distance and estimated days

### RouteSegment
- Foreign key to Trip
- Segment type (drive, pickup, dropoff, refuel, rest, break)
- Start/end locations, duration, distance
- Sequence order

### LogSheet
- Foreign key to Trip
- Day number
- Graph points (time-status pairs)
- Summary statistics (driving, on-duty, rest hours)