# Quick Sample Data Insert
# Run this in Django shell: python manage.py shell < sample_data.py

from monitor.models import RectifierData
import time

# Delete old data
RectifierData.objects.all().delete()

# Create sample data
timestamp = int(time.time() * 1000)

sample = RectifierData.objects.create(
    timestamp=timestamp,
    
    # Site Info
    site_name="NYK_WORKSHOP",
    project_id="23XL05C0027",
    ladder="Ladder-1",
    sla="2 Hour",
    status_realtime="Normal",
    status_ladder="Over",
    latitude=-6.305489261279732,
    longitude=106.95865111442095,
    
    # Environment
    door_cabinet="Close",
    battery_stolen="Close",
    temperature=33.6,
    humidity=62.2,
    
    # Rectifier Status
    vac_input_l1=203.20,
    vac_input_l2=225.10,
    vac_input_l3=None,
    vdc_output=54.0,
    battery_current=0.0,
    iac_input_l1=None,
    iac_input_l2=None,
    iac_input_l3=None,
    load_current=63.7,
    load_power=3.44,
    pac_load_l1=0.00,
    pac_load_l2=0.00,
    pac_load_l3=0.00,
    rectifier_current=63.7,
    total_power=3.44,
    
    # Battery Bank 1
    battery_bank_1_voltage=53.34,
    battery_bank_1_current=0,
    battery_bank_1_soc=100,
    battery_bank_1_soh=100,
    
    # Battery Bank 2
    battery_bank_2_voltage=53.42,
    battery_bank_2_current=0,
    battery_bank_2_soc=100,
    battery_bank_2_soh=100,
    
    # Battery Bank 3
    battery_bank_3_voltage=52.90,
    battery_bank_3_current=0,
    battery_bank_3_soc=100,
    battery_bank_3_soh=100,
    
    # Battery Status
    backup_duration=None,
    time_remaining=None,
    battery_status="Standby",
    start_backup="No data",
    soc_avg=100,
    
    # Modules
    modules_status=[
        {"id": 1, "status": "Fault", "value": "LK23290..."},
        {"id": 2, "status": "Protect", "value": "LK23140..."},
        {"id": 3, "status": "Fault", "value": "LK23140..."},
        {"id": 4, "status": "Fault", "value": "LK23290..."},
        {"id": 5, "status": "AC Off", "value": "-"},
        {"id": 6, "status": "AC Off", "value": "-"},
    ]
)

print("✓ Sample data created!")
print(f"  ID: {sample.id}")
print(f"  Site: {sample.site_name}")
print(f"  Timestamp: {sample.timestamp}")
print("\nNow test API:")
print("  http://localhost:8000/api/rectifier/dashboard/")
print("\nOr refresh frontend:")
print("  http://localhost:3000")
