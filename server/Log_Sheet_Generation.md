# 📊 Log Sheet Generation from Trip Route

## 🧠 Goal

Convert a given route (with driving, rest, refuel, pickup/dropoff events) into ELD-style log sheets that reflect the driver’s duty status across each 24-hour period.

---

## ✅ ELD Log Sheet Format

Each 24-hour log is a graph of status changes:

- **off-duty**: Resting (includes overnight rest)
- **on-duty**: Working but not driving (refuel, pickup/dropoff)
- **driving**: Driving the vehicle
- **break**: Short breaks if applicable

---

## ✅ HOS (Hours of Service) Constraints

| Rule                            | Limit            |
|---------------------------------|------------------|
| Max driving per day             | 11 hours         |
| Mandatory rest after drive      | 10 hours         |
| 30-minute break after 8 hours   | Required         |
| 70-hour/8-day total on-duty cap | Tracked overall  |

---

## 🗂️ Input: Trip Route JSON

```json
{
  "trip_id": "069be255-b77f-41da-aa64-f98f8fb79db6",
  "total_distance_km": 3948.26,
  "estimated_days": 3,
  "route": [
    { "type": "drive", "duration_minutes": 686 },
    { "type": "rest", "duration_minutes": 600 },
    { "type": "pickup", "duration_minutes": 60 },
    { "type": "drive", "duration_minutes": 965 },
    { "type": "refuel", "duration_minutes": 30 },
    { "type": "drive", "duration_minutes": 716 },
    { "type": "rest", "duration_minutes": 600 },
    { "type": "dropoff", "duration_minutes": 60 }
  ]
}
```

---

## 📅 Simulated Daily Breakdown

### Day 1
- 00:00–11:26 → driving (686 min)
- 11:26–21:26 → off-duty (600 min)
- 21:26–22:26 → on-duty (pickup)
- 22:26–00:00 → driving (94 min)

### Day 2
- 00:00–08:40 → driving (start of 965-min segment)
- 08:40–18:40 → off-duty (required rest)
- 18:40–23:40 → driving (resume)
- 23:40–00:00 → on-duty (next day refuel prep)

### Day 3
- 00:00–00:30 → on-duty (refuel)
- 00:30–12:16 → driving (716 min)
- 12:16–22:16 → off-duty
- 22:16–23:16 → on-duty (dropoff)
- 23:16–00:00 → off-duty

---

## 🧾 Final Output: `/trip-plans/{id}/logs/`

```json
{
  "trip_id": "069be255-b77f-41da-aa64-f98f8fb79db6",
  "logs": [
    {
      "day": 1,
      "graph_points": [
        { "time": "00:00", "status": "driving" },
        { "time": "11:26", "status": "off-duty" },
        { "time": "21:26", "status": "on-duty" },
        { "time": "22:26", "status": "driving" }
      ],
      "summary": {
        "driving_hours": 11.4,
        "on_duty_hours": 1,
        "rest_hours": 10
      }
    },
    {
      "day": 2,
      "graph_points": [
        { "time": "00:00", "status": "driving" },
        { "time": "08:40", "status": "off-duty" },
        { "time": "18:40", "status": "driving" },
        { "time": "23:40", "status": "on-duty" }
      ],
      "summary": {
        "driving_hours": 10,
        "on_duty_hours": 0.5,
        "rest_hours": 10
      }
    },
    {
      "day": 3,
      "graph_points": [
        { "time": "00:00", "status": "on-duty" },
        { "time": "00:30", "status": "driving" },
        { "time": "12:16", "status": "off-duty" },
        { "time": "22:16", "status": "on-duty" },
        { "time": "23:16", "status": "off-duty" }
      ],
      "summary": {
        "driving_hours": 12,
        "on_duty_hours": 1.5,
        "rest_hours": 10
      }
    }
  ]
}
```

---

## 🛠️ Next Step

Would you like code to automatically generate this structure given any trip route?