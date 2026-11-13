from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from .models import RectifierData
from .serializers import RectifierDataSerializer, RectifierStatsSerializer, DashboardDataSerializer, safe_jitter

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
            site_name = request.query_params.get('site_name')
            if site_name:
                data = RectifierData.objects.filter(site_name=site_name).first()
            else:
                data = RectifierData.objects.first()
            
            if data:
                serializer = DashboardDataSerializer(data)
                return Response(serializer.data)
            return Response({'message': 'No data available'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def sites(self, request):
        """Endpoint untuk daftar semua titik site koordinat yang termonitoring"""
        try:
            sites_data = []
            site_names = RectifierData.objects.values_list('site_name', flat=True).distinct()
            for s_name in site_names:
                latest = RectifierData.objects.filter(site_name=s_name).first()
                if latest and latest.latitude is not None and latest.longitude is not None:
                    sites_data.append({
                        'siteName': latest.site_name,
                        'projectId': latest.project_id,
                        'ladder': latest.ladder,
                        'sla': latest.sla,
                        'statusRealtime': latest.status_realtime,
                        'statusLadder': latest.status_ladder,
                        'latitude': latest.latitude,
                        'longitude': latest.longitude,
                        'lastData': latest.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                        'temperature': safe_jitter(latest.temperature or 31.5, 30.0, 34.0, 0.2, 1),
                        'humidity': safe_jitter(latest.humidity or 62.0, 58.0, 66.0, 0.4, 1),
                        'vdcOutput': safe_jitter(latest.vdc_output or 54.0, 53.7, 54.3, 0.05, 2),
                        'loadCurrent': safe_jitter(latest.load_current or 58.0, 50.0, 65.0, 0.4, 1),
                        'batteryStatus': latest.battery_status,
                        'socAvg': latest.soc_avg,
                        'fuelLiter': safe_jitter(getattr(latest, 'fuel_level_liter', 120.0) or 120.0, 110.0, 160.0, 0.1, 1),
                        'gensetStatus': getattr(latest, 'genset_status', 'Mati') or 'Mati',
                        'plnVoltage': safe_jitter(getattr(latest, 'pln_voltage', 220.0) or 220.0, 217.5, 223.5, 0.6, 1),
                        'solarVoltage': safe_jitter(getattr(latest, 'mppt_pv_voltage', 65.0) or 65.0, 64.0, 71.5, 0.5, 1),
                    })
            return Response(sites_data)
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
