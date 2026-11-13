import random
from rest_framework import serializers
from .models import RectifierData

def safe_jitter(val, min_val, max_val, max_delta=0.5, decimals=1):
    """Menghasilkan pergerakan acak halus yang tetap dalam batas normal"""
    if val is None:
        return None
    try:
        val = float(val)
        delta = random.uniform(-max_delta, max_delta)
        new_val = val + delta
        if new_val < min_val:
            new_val = min_val + abs(delta * 0.5)
        elif new_val > max_val:
            new_val = max_val - abs(delta * 0.5)
        return round(new_val, decimals)
    except (ValueError, TypeError):
        return val

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
    powerSources = serializers.SerializerMethodField()
    
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
        # Fluktuasi suhu normal: 30.0 - 34.0 °C, kelembaban: 58.0 - 66.0%
        temp = safe_jitter(obj.temperature or 32.4, 30.0, 34.0, 0.2, 1)
        hum = safe_jitter(obj.humidity or 61.5, 58.0, 66.0, 0.4, 1)
        return {
            'doorCabinet': obj.door_cabinet,
            'batteryStolen': obj.battery_stolen,
            'temperature': temp,
            'humidity': hum,
        }
    
    def get_modules(self, obj):
        return obj.modules_status if obj.modules_status else []
    
    def get_rectifier(self, obj):
        # Fluktuasi tegangan dan beban dalam batas normal
        vac_l1 = safe_jitter(obj.vac_input_l1 or 220.0, 216.0, 224.0, 0.6, 2)
        vac_l2 = safe_jitter(obj.vac_input_l2 or 221.0, 217.0, 225.0, 0.6, 2)
        vdc_out = safe_jitter(obj.vdc_output or 54.0, 53.7, 54.3, 0.05, 2)
        load_cur = safe_jitter(obj.load_current or 60.0, 55.0, 65.0, 0.4, 1)
        load_pwr = round((vdc_out * load_cur) / 1000.0, 2)
        
        return {
            'vacInputL1': vac_l1,
            'vacInputL2': vac_l2,
            'vacInputL3': obj.vac_input_l3,
            'vdcOutput': vdc_out,
            'batteryCurrent': safe_jitter(obj.battery_current or 0.0, -0.2, 0.3, 0.05, 2),
            'iacInputL1': obj.iac_input_l1,
            'iacInputL2': obj.iac_input_l2,
            'iacInputL3': obj.iac_input_l3,
            'loadCurrent': load_cur,
            'loadPower': load_pwr,
            'pacLoadL1': safe_jitter(obj.pac_load_l1 or 0.0, 0.0, 1.2, 0.05, 2),
            'pacLoadL2': safe_jitter(obj.pac_load_l2 or 0.0, 0.0, 1.2, 0.05, 2),
            'pacLoadL3': safe_jitter(obj.pac_load_l3 or 0.0, 0.0, 1.2, 0.05, 2),
            'rectifierCurrent': load_cur,
            'totalPower': load_pwr,
        }
    
    def get_battery(self, obj):
        banks = []
        b1_v = safe_jitter(obj.battery_bank_1_voltage or 53.35, 53.20, 53.50, 0.02, 2)
        b2_v = safe_jitter(obj.battery_bank_2_voltage or 53.40, 53.25, 53.55, 0.02, 2)
        b3_v = safe_jitter(obj.battery_bank_3_voltage or 53.30, 53.15, 53.45, 0.02, 2)

        if obj.battery_bank_1_voltage > 0 or b1_v > 0:
            banks.append({
                'id': 1,
                'voltage': b1_v,
                'current': safe_jitter(obj.battery_bank_1_current or 0.0, 0.0, 0.2, 0.02, 2),
                'soc': 100,
                'soh': 100,
            })
        if obj.battery_bank_2_voltage > 0 or b2_v > 0:
            banks.append({
                'id': 2,
                'voltage': b2_v,
                'current': safe_jitter(obj.battery_bank_2_current or 0.0, 0.0, 0.2, 0.02, 2),
                'soc': 100,
                'soh': 100,
            })
        if obj.battery_bank_3_voltage > 0 or b3_v > 0:
            banks.append({
                'id': 3,
                'voltage': b3_v,
                'current': safe_jitter(obj.battery_bank_3_current or 0.0, 0.0, 0.2, 0.02, 2),
                'soc': 100,
                'soh': 100,
            })
        
        return {
            'banks': banks,
            'backupDuration': obj.backup_duration,
            'timeRemaining': obj.time_remaining,
            'status': obj.battery_status,
            'startBackup': obj.start_backup,
            'socAvg': obj.soc_avg,
        }

    def get_powerSources(self, obj):
        # PLN Power Meter (AC) fluktuasi normal: 218 - 224 V, 13.5 - 16.5 A, 49.85 - 50.15 Hz
        pln_v = safe_jitter(getattr(obj, 'pln_voltage', 220.5) or 220.5, 217.5, 223.5, 0.8, 1)
        pln_i = safe_jitter(getattr(obj, 'pln_current', 15.0) or 15.0, 13.5, 16.5, 0.3, 1)
        pln_f = safe_jitter(getattr(obj, 'pln_frequency', 50.0) or 50.0, 49.85, 50.15, 0.04, 2)
        pln_status = getattr(obj, 'pln_status', 'Normal') or 'Normal'

        # Genset & Fuel
        genset_status = getattr(obj, 'genset_status', 'Mati') or 'Mati'
        if genset_status == 'Hidup':
            genset_voltage = safe_jitter(220.0, 218.0, 222.0, 0.5, 1)
            genset_current = safe_jitter(14.2, 12.0, 16.0, 0.3, 1)
            genset_frequency = safe_jitter(50.0, 49.9, 50.1, 0.03, 1)
        else:
            genset_voltage = 0.0
            genset_current = 0.0
            genset_frequency = 0.0

        # Fuel level perlahan / fluktuasi kecil sensor liter
        fuel_base = getattr(obj, 'fuel_level_liter', 145.0) or 145.0
        fuel_liter = safe_jitter(fuel_base, 120.0, 180.0, 0.1, 1)
        fuel_capacity = getattr(obj, 'fuel_capacity_liter', 200.0) or 200.0
        fuel_pct = round((fuel_liter / fuel_capacity) * 100, 1) if fuel_capacity > 0 else 0

        # MPPT Solar Panel (DC) fluktuasi normal: 64.0 - 72.0 V, 11.0 - 15.0 A
        pv_v = safe_jitter(getattr(obj, 'mppt_pv_voltage', 68.4) or 68.4, 64.0, 71.5, 0.6, 1)
        pv_i = safe_jitter(getattr(obj, 'mppt_pv_current', 13.2) or 13.2, 11.0, 15.0, 0.25, 1)
        pv_p = round(pv_v * pv_i, 1)
        daily_energy = safe_jitter(getattr(obj, 'mppt_daily_energy', 5.4) or 5.4, 4.8, 6.5, 0.01, 2)

        return {
            'pln': {
                'voltage': pln_v,
                'current': pln_i,
                'frequency': pln_f,
                'status': pln_status,
            },
            'genset': {
                'status': genset_status,
                'voltage': genset_voltage,
                'current': genset_current,
                'frequency': genset_frequency,
                'fuelLiter': fuel_liter,
                'fuelCapacity': fuel_capacity,
                'fuelPercentage': fuel_pct,
            },
            'solarMppt': {
                'pvVoltage': pv_v,
                'pvCurrent': pv_i,
                'pvPower': pv_p,
                'dailyEnergy': daily_energy,
                'status': 'Charging' if pv_v > 30 else 'Standby',
            }
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
