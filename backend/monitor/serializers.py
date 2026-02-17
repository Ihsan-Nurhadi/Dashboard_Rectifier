from rest_framework import serializers
from .models import RectifierData

class RectifierDataSerializer(serializers.ModelSerializer):
    """Serializer untuk RectifierData"""
    
    class Meta:
        model = RectifierData
        fields = '__all__'
        read_only_fields = ['id', 'created_at']

class DashboardDataSerializer(serializers.Serializer):
    """Serializer untuk format dashboard frontend"""
    siteInfo = serializers.SerializerMethodField()
    environment = serializers.SerializerMethodField()
    modules = serializers.SerializerMethodField()
    rectifier = serializers.SerializerMethodField()
    battery = serializers.SerializerMethodField()
    
    def get_siteInfo(self, obj):
        return {
            'siteName': obj.site_name,
            'projectId': obj.project_id,
            'ladder': obj.ladder,
            'sla': obj.sla,
            'statusRealtime': obj.status_realtime,
            'statusLadder': obj.status_ladder,
            'lastData': obj.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'location': {
                'lat': obj.latitude or 0,
                'lng': obj.longitude or 0,
            }
        }
    
    def get_environment(self, obj):
        return {
            'doorCabinet': obj.door_cabinet,
            'batteryStolen': obj.battery_stolen,
            'temperature': obj.temperature,
            'humidity': obj.humidity,
        }
    
    def get_modules(self, obj):
        return obj.modules_status if obj.modules_status else []
    
    def get_rectifier(self, obj):
        return {
            'vacInputL1': obj.vac_input_l1,
            'vacInputL2': obj.vac_input_l2,
            'vacInputL3': obj.vac_input_l3,
            'vdcOutput': obj.vdc_output,
            'batteryCurrent': obj.battery_current,
            'iacInputL1': obj.iac_input_l1,
            'iacInputL2': obj.iac_input_l2,
            'iacInputL3': obj.iac_input_l3,
            'loadCurrent': obj.load_current,
            'loadPower': obj.load_power,
            'pacLoadL1': obj.pac_load_l1,
            'pacLoadL2': obj.pac_load_l2,
            'pacLoadL3': obj.pac_load_l3,
            'rectifierCurrent': obj.rectifier_current,
            'totalPower': obj.total_power,
        }
    
    def get_battery(self, obj):
        banks = []
        if obj.battery_bank_1_voltage > 0:
            banks.append({
                'id': 1,
                'voltage': obj.battery_bank_1_voltage,
                'current': obj.battery_bank_1_current,
                'soc': obj.battery_bank_1_soc,
                'soh': obj.battery_bank_1_soh,
            })
        if obj.battery_bank_2_voltage > 0:
            banks.append({
                'id': 2,
                'voltage': obj.battery_bank_2_voltage,
                'current': obj.battery_bank_2_current,
                'soc': obj.battery_bank_2_soc,
                'soh': obj.battery_bank_2_soh,
            })
        if obj.battery_bank_3_voltage > 0:
            banks.append({
                'id': 3,
                'voltage': obj.battery_bank_3_voltage,
                'current': obj.battery_bank_3_current,
                'soc': obj.battery_bank_3_soc,
                'soh': obj.battery_bank_3_soh,
            })
        
        return {
            'banks': banks,
            'backupDuration': obj.backup_duration,
            'timeRemaining': obj.time_remaining,
            'status': obj.battery_status,
            'startBackup': obj.start_backup,
            'socAvg': obj.soc_avg,
        }

class RectifierStatsSerializer(serializers.Serializer):
    """Serializer untuk statistik"""
    avg_vdc_output = serializers.FloatField()
    max_vdc_output = serializers.FloatField()
    min_vdc_output = serializers.FloatField()
    avg_load_current = serializers.FloatField()
    max_load_current = serializers.FloatField()
    avg_temperature = serializers.FloatField()
    avg_humidity = serializers.FloatField()
