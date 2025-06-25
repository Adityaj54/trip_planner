from django.urls import path
from . import views

urlpatterns = [
    path('trip-plans/', views.create_trip_plan, name='create_trip_plan'),
    path('trip-plans/<uuid:trip_id>/', views.get_trip_plan, name='get_trip_plan'),
    path('trip-plans/<uuid:trip_id>/logs/', views.get_trip_logs, name='get_trip_logs'),
]