# 📝 Project Specification: ELD Trip Planner

## 🎯 Objective

Build a full-stack web application to help property-carrying truck drivers plan their routes with compliance to Hours of Service (HOS) regulations and render ELD-style log sheets. The system takes location inputs and driver hours and returns a route with annotated stops and a set of log sheets for the trip.

---

use the below repo for the code styles and pattern 

pwd
/Users/adityaaralimara/IdeaProjects/cmp_v2_service_express



## ✅ Functional Requirements

### User Inputs
- Current Location (latitude, longitude)
- Pickup Location (latitude, longitude)
- Dropoff Location (latitude, longitude)
- Current Cycle Used Hours (0–70)

### System Outputs
- Visual Route Map with:
  - Start → Pickup → Dropoff route
  - Refueling stops every 1000 miles
  - Mandatory rest breaks
  - Pickup/Dropoff events (1 hour each)
- Log Sheets:
  - For each day of trip
  - Show 24-hour ELD-style duty status (graph data)
  - States: Off-Duty, On-Duty, Driving, Break

### Additional Functional Logic
- Adhere to FMCSA HOS rules:
  - Max 11 hrs driving per day
  - 10 hrs rest after driving window
  - 30-min break after 8 hrs of driving
  - 70-hour/8-day rolling cycle
- Recalculate stops/rest/fuel based on total route distance and drive time
- Persist trip plan and make logs retrievable

---

## 📉 Non-Functional Requirements

| Category       | Description |
|----------------|-------------|
| Performance    | API must return route & log sheet data in under 2s |
| Scalability    | API should handle up to 100 concurrent users (MVP) |
| Security       | Use HTTPS, CORS policies; Auth not required for MVP |
| Maintainability| Modular and clean codebase, reusable components |
| UX/UI          | Mobile responsive, map interaction UX must be intuitive |
| Availability   | ≥99.5% uptime on hosted services |
| Compliance     | Simulate realistic behavior as per FMCSA guidelines |
| Documentation  | Swagger/OpenAPI or auto-generated DRF docs |

---

## 🔌 API Design

### Base URL: `/api/v1`

### POST `/trip-plans/`

**Request Body:**
```json
{
  "current_location": {"lat": 40.7128, "lng": -74.0060},
  "pickup_location": {"lat": 41.8781, "lng": -87.6298},
  "dropoff_location": {"lat": 34.0522, "lng": -118.2437},
  "current_cycle_used_hours": 20
}
```

**Response:**
```json
{
  "trip_id": "uuid",
  "total_distance_km": 4500,
  "estimated_days": 5,
  "route": [
    {
      "type": "drive",
      "start": "current_location",
      "end": "pickup_location",
      "distance_km": 1300,
      "estimated_hours": 11
    },
    {
      "type": "pickup", "location": {...}, "duration_minutes": 60
    },
    {
      "type": "refuel", "location": {...}, "distance_since_last_fuel_km": 1000
    }
  ]
}
```

### GET `/trip-plans/{trip_id}/`
Fetch metadata about a specific trip.

### GET `/trip-plans/{trip_id}/logs/`

**Response:**
```json
{
  "trip_id": "uuid",
  "logs": [
    {
      "day": 1,
      "graph_points": [
        {"time": "00:00", "status": "off-duty"},
        {"time": "07:00", "status": "on-duty"},
        {"time": "08:00", "status": "driving"},
        {"time": "12:00", "status": "break"},
        {"time": "12:30", "status": "driving"},
        {"time": "18:00", "status": "off-duty"}
      ],
      "summary": {
        "driving_hours": 9,
        "rest_hours": 10,
        "on_duty_hours": 10
      }
    }
  ]
}
```

---

## 🧱 High-Level Architecture (HLD)

### 🌐 Frontend (React)
- Tech: React.js + TailwindCSS or Material UI
- Pages:
  - Home → Input Form
  - Trip Summary → Map + Log Sheet
- Libraries:
  - `react-leaflet` for maps
  - `axios` for API requests
  - `react-svg` or `canvas` for log rendering

### ⚙️ Backend (Django)
- Django + Django REST Framework
- Core Apps:
  - `trip_planner`: Trip, RouteSegment, LogSheet models
  - `route_engine`: routing, refueling, rest logic
- PostgreSQL or SQLite
- OpenRouteService API

---

## 🗺️ Map Flow (Frontend)
1. User submits form
2. Frontend calls POST `/trip-plans/`
3. Backend computes route + logs
4. Response rendered on map and as SVG log sheets

---

## 🧩 Low-Level Design (LLD)

### Models
```python
class Trip(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    created_at = models.DateTimeField(auto_now_add=True)
    current_location = models.JSONField()
    pickup_location = models.JSONField()
    dropoff_location = models.JSONField()
    current_cycle_used_hours = models.IntegerField()
    total_distance_km = models.FloatField()
    estimated_days = models.IntegerField()

class RouteSegment(models.Model):
    trip = models.ForeignKey(Trip, related_name='segments', on_delete=models.CASCADE)
    type = models.CharField(choices=[...])
    start_location = models.JSONField(null=True)
    end_location = models.JSONField(null=True)
    duration_minutes = models.IntegerField(null=True)
    distance_km = models.FloatField(null=True)

class LogSheet(models.Model):
    trip = models.ForeignKey(Trip, related_name='logs', on_delete=models.CASCADE)
    day_number = models.IntegerField()
    graph_points = models.JSONField()
    summary = models.JSONField()
```

---

## ✅ Deliverables Recap

- Hosted app on Vercel (frontend) + Render (backend)
- API with:
  - `/trip-plans/`
  - `/trip-plans/{id}/`
  - `/trip-plans/{id}/logs/`
- UI for form, map, and logs
- GitHub repo with README
- Loom video demo