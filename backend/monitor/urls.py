from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RectifierDataViewSet

router = DefaultRouter()
router.register(r'rectifier', RectifierDataViewSet, basename='rectifier')

urlpatterns = [
    path('', include(router.urls)),
]
