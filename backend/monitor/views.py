from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from .models import RectifierData
from .serializers import RectifierDataSerializer, RectifierStatsSerializer, DashboardDataSerializer

class RectifierDataViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet untuk data rectifier
    Hanya read-only karena data dikirim via MQTT
    """
    queryset = RectifierData.objects.all()
    serializer_class = RectifierDataSerializer
    
    def get_queryset(self):
        """Filter data berdasarkan query params"""
        queryset = RectifierData.objects.all()
        
        # Filter by limit
        limit = self.request.query_params.get('limit', 100)
        try:
            limit = int(limit)
            if limit > 1000:
                limit = 1000
        except ValueError:
            limit = 100
            
        return queryset[:limit]
    
    @action(detail=False, methods=['get'])
    def latest(self, request):
        """Endpoint untuk mendapatkan data terbaru"""
        try:
            data = RectifierData.objects.first()
            if data:
                serializer = self.get_serializer(data)
                return Response(serializer.data)
            return Response({'message': 'No data available'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Endpoint untuk format dashboard frontend Next.js"""
        try:
            data = RectifierData.objects.first()
            if data:
                serializer = DashboardDataSerializer(data)
                return Response(serializer.data)
            return Response({'message': 'No data available'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Endpoint untuk statistik data"""
        try:
            stats = RectifierData.get_stats()
            if stats:
                serializer = RectifierStatsSerializer(stats)
                return Response(serializer.data)
            return Response({'message': 'No data available'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def chart_data(self, request):
        """Endpoint untuk data chart (last 50 points)"""
        limit = request.query_params.get('limit', 50)
        try:
            limit = int(limit)
            if limit > 200:
                limit = 200
        except ValueError:
            limit = 50
        
        data = RectifierData.objects.all()[:limit]
        
        # Format data untuk chart
        chart_data = {
            'timestamps': [d.timestamp for d in reversed(data)],
            'vdc_output': [d.vdc_output for d in reversed(data)],
            'load_current': [d.load_current for d in reversed(data)],
            'temperature': [d.temperature for d in reversed(data)],
            'humidity': [d.humidity for d in reversed(data)],
        }
        
        return Response(chart_data)
