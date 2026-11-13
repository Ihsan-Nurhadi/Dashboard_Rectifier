from django.db import models
from django.utils import timezone

class RectifierData(models.Model):
    """Model untuk menyimpan data rectifier lengkap"""
    timestamp = models.BigIntegerField()
    
    # Site Info
    site_name = models.CharField(max_length=255, default='')
    project_id = models.CharField(max_length=255, default='')
    ladder = models.CharField(max_length=100, default='')
    sla = models.CharField(max_length=100, default='')
    status_realtime = models.CharField(max_length=50, default='Normal')
    status_ladder = models.CharField(max_length=50, default='Normal')
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    
    # Environment Status
    door_cabinet = models.CharField(max_length=20, default='Close')
    battery_stolen = models.CharField(max_length=20, default='Close')
    temperature = models.FloatField(default=0)
    humidity = models.FloatField(default=0)
    
    # Rectifier Status
    vac_input_l1 = models.FloatField(default=0)
    vac_input_l2 = models.FloatField(default=0)
    vac_input_l3 = models.FloatField(null=True, blank=True)
    vdc_output = models.FloatField(default=0)
    battery_current = models.FloatField(default=0)
    iac_input_l1 = models.FloatField(null=True, blank=True)
    iac_input_l2 = models.FloatField(null=True, blank=True)
    iac_input_l3 = models.FloatField(null=True, blank=True)
    load_current = models.FloatField(default=0)
    load_power = models.FloatField(default=0)
    pac_load_l1 = models.FloatField(default=0)
    pac_load_l2 = models.FloatField(default=0)
    pac_load_l3 = models.FloatField(default=0)
    rectifier_current = models.FloatField(default=0)
    total_power = models.FloatField(default=0)
    
    # Battery Banks (storing as JSON-like fields)
    battery_bank_1_voltage = models.FloatField(default=0)
    battery_bank_1_current = models.FloatField(default=0)
    battery_bank_1_soc = models.FloatField(default=100)
    battery_bank_1_soh = models.FloatField(default=100)
    
    battery_bank_2_voltage = models.FloatField(default=0)
    battery_bank_2_current = models.FloatField(default=0)
    battery_bank_2_soc = models.FloatField(default=100)
    battery_bank_2_soh = models.FloatField(default=100)
    
    battery_bank_3_voltage = models.FloatField(default=0)
    battery_bank_3_current = models.FloatField(default=0)
    battery_bank_3_soc = models.FloatField(default=100)
    battery_bank_3_soh = models.FloatField(default=100)
    
    # Battery Status
    backup_duration = models.IntegerField(null=True, blank=True)
    time_remaining = models.IntegerField(null=True, blank=True)
    battery_status = models.CharField(max_length=50, default='Standby')
    start_backup = models.CharField(max_length=100, default='No data')
    soc_avg = models.FloatField(default=100)
    
    # Module Status (storing as JSON string)
    modules_status = models.JSONField(default=list, blank=True)
    
    # Power Meter PLN (AC)
    pln_voltage = models.FloatField(default=220.0, null=True, blank=True)
    pln_current = models.FloatField(default=15.0, null=True, blank=True)
    pln_frequency = models.FloatField(default=50.0, null=True, blank=True)
    pln_status = models.CharField(max_length=20, default='Normal')

    # Genset & Fuel
    genset_status = models.CharField(max_length=20, default='Mati')  # Hidup / Mati
    genset_voltage = models.FloatField(default=0.0, null=True, blank=True)
    genset_current = models.FloatField(default=0.0, null=True, blank=True)
    genset_frequency = models.FloatField(default=0.0, null=True, blank=True)
    fuel_level_liter = models.FloatField(default=120.0, null=True, blank=True)  # Liter
    fuel_capacity_liter = models.FloatField(default=200.0, null=True, blank=True)  # Kapasitas tangki

    # MPPT Solar Panel (DC)
    mppt_pv_voltage = models.FloatField(default=65.0, null=True, blank=True)  # Tegangan DC dari Solar Panel
    mppt_pv_current = models.FloatField(default=12.0, null=True, blank=True)
    mppt_pv_power = models.FloatField(default=780.0, null=True, blank=True)
    mppt_daily_energy = models.FloatField(default=4.8, null=True, blank=True)

    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['-timestamp']),
            models.Index(fields=['-created_at']),
        ]
    
    def __str__(self):
        return f"Rectifier Data - {self.site_name} - {self.timestamp}"
    
    @classmethod
    def get_latest(cls, limit=1):
        """Ambil data terbaru"""
        return cls.objects.all()[:limit]
    
    @classmethod
    def get_stats(cls):
        """Ambil statistik data"""
        from django.db.models import Avg, Max, Min
        return cls.objects.aggregate(
            avg_vdc_output=Avg('vdc_output'),
            max_vdc_output=Max('vdc_output'),
            min_vdc_output=Min('vdc_output'),
            avg_load_current=Avg('load_current'),
            max_load_current=Max('load_current'),
            avg_temperature=Avg('temperature'),
            avg_humidity=Avg('humidity'),
        )
