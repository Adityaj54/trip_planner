import requests
import json

# Test data based on spec
test_data = {
    "current_location": {"lat": 40.7128, "lng": -74.0060},
    "pickup_location": {"lat": 41.8781, "lng": -87.6298},
    "dropoff_location": {"lat": 34.0522, "lng": -118.2437},
    "current_cycle_used_hours": 20
}

try:
    # Test trip creation
    response = requests.post(
        'http://localhost:8000/api/v1/trip-plans/',
        json=test_data,
        headers={'Content-Type': 'application/json'}
    )
    
    print("Trip Creation Response:")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 201:
        trip_data = response.json()
        trip_id = trip_data['trip_id']
        
        # Test trip detail
        detail_response = requests.get(f'http://localhost:8000/api/v1/trip-plans/{trip_id}/')
        print(f"\nTrip Detail Response:")
        print(f"Status Code: {detail_response.status_code}")
        print(f"Response: {detail_response.json()}")
        
        # Test trip logs
        logs_response = requests.get(f'http://localhost:8000/api/v1/trip-plans/{trip_id}/logs/')
        print(f"\nTrip Logs Response:")
        print(f"Status Code: {logs_response.status_code}")
        print(f"Response: {logs_response.json()}")

except Exception as e:
    print(f"Error: {e}")