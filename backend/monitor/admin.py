from django.contrib import admin
from .models import RectifierData

@admin.register(RectifierData)
class RectifierDataAdmin(admin.ModelAdmin):
    list_display = [
        'id', 
        'timestamp', 
        'site_name',
        'vdc_output', 
        'load_current', 
        'temperature',
        'status_realtime',
        'created_at'
    ]
    list_filter = ['created_at', 'status_realtime', 'site_name']
    search_fields = ['site_name', 'project_id']
    ordering = ['-timestamp']
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('Site Information', {
            'fields': ('timestamp', 'site_name', 'project_id', 'ladder', 'sla', 
                      'status_realtime', 'status_ladder', 'latitude', 'longitude')
        }),
        ('Environment', {
            'fields': ('temperature', 'humidity', 'door_cabinet', 'battery_stolen')
        }),
        ('Rectifier Status', {
            'fields': ('vac_input_l1', 'vac_input_l2', 'vac_input_l3',
                      'vdc_output', 'battery_current',
                      'iac_input_l1', 'iac_input_l2', 'iac_input_l3',
                      'load_current', 'load_power',
                      'pac_load_l1', 'pac_load_l2', 'pac_load_l3',
                      'rectifier_current', 'total_power')
        }),
        ('Battery Banks', {
            'fields': (
                ('battery_bank_1_voltage', 'battery_bank_1_current', 'battery_bank_1_soc', 'battery_bank_1_soh'),
                ('battery_bank_2_voltage', 'battery_bank_2_current', 'battery_bank_2_soc', 'battery_bank_2_soh'),
                ('battery_bank_3_voltage', 'battery_bank_3_current', 'battery_bank_3_soc', 'battery_bank_3_soh'),
            )
        }),
        ('Battery Status', {
            'fields': ('backup_duration', 'time_remaining', 'battery_status', 'start_backup', 'soc_avg')
        }),
        ('Modules', {
            'fields': ('modules_status',),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    def has_add_permission(self, request):
        # Temporary: allow manual add for testing
        return True
    
    def has_change_permission(self, request, obj=None):
        # Temporary: allow edit for testing
        return True
