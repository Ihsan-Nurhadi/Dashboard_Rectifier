# Quick URL Test Script
# Run: python test_urls.py

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rectifier_monitor.settings')
django.setup()

from django.urls import get_resolver
from rest_framework.routers import DefaultRouter
from monitor.views import RectifierDataViewSet

print("\n" + "="*60)
print("Testing URL Registration")
print("="*60)

# Test router
router = DefaultRouter()
router.register(r'rectifier', RectifierDataViewSet, basename='rectifier')

print("\nRouter URLs:")
for url in router.urls:
    print(f"  ✓ {url.pattern}")

print("\nExpected endpoints:")
print("  - /api/rectifier/")
print("  - /api/rectifier/latest/")
print("  - /api/rectifier/dashboard/")
print("  - /api/rectifier/stats/")
print("  - /api/rectifier/chart_data/")

print("\nAll URLs in project:")
resolver = get_resolver()
for pattern in resolver.url_patterns:
    print(f"  {pattern}")

print("="*60 + "\n")
