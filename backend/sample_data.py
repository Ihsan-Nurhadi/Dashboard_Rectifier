# Quick Sample Data Insert for all 7 sites
import os
import sys
import django
import time
import json

# Setup django environment if executed directly
if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rectifier_monitor.settings')
    try:
        django.setup()
    except Exception:
        pass

from monitor.models import RectifierData

sites = [
    {
        'site_name': 'NYK_SERANG_01',
        'project_id': '23XL05C0008',
        'ladder': 'Ladder-1',
        'sla': '2 Hour',
        'status_realtime': 'Normal',
        'status_ladder': 'Normal',
        'latitude': -6.115286,
        'longitude': 106.154228,
        'temperature': 31.4,
        'humidity': 65.0,
        'vac_l1': 220.0, 'vac_l2': 221.5, 'vdc': 53.9, 'load_cur': 48.5, 'total_pwr': 2.61,
        'b1_v': 53.40, 'b2_v': 53.45, 'b3_v': 53.30,
        'pln_v': 220.5, 'pln_i': 14.8, 'pln_f': 50.0, 'pln_status': 'Normal',
        'genset_status': 'Mati', 'fuel_liter': 140.0, 'solar_v': 66.5, 'solar_i': 12.5, 'solar_p': 831.0
    },
    {
        'site_name': 'NYK_WORKSHOP',
        'project_id': '23XL05C0027',
        'ladder': 'Ladder-1',
        'sla': '2 Hour',
        'status_realtime': 'Normal',
        'status_ladder': 'Over',
        'latitude': -6.305489261279732,
        'longitude': 106.95865111442095,
        'temperature': 33.6,
        'humidity': 62.2,
        'vac_l1': 203.20, 'vac_l2': 225.10, 'vdc': 54.0, 'load_cur': 63.7, 'total_pwr': 3.44,
        'b1_v': 53.34, 'b2_v': 53.42, 'b3_v': 52.90,
        'pln_v': 221.4, 'pln_i': 15.2, 'pln_f': 50.1, 'pln_status': 'Normal',
        'genset_status': 'Mati', 'fuel_liter': 145.0, 'solar_v': 68.5, 'solar_i': 14.2, 'solar_p': 972.7
    },
    {
        'site_name': 'NYK_CENTRAL_JKT',
        'project_id': '23XL05C0012',
        'ladder': 'Ladder-2',
        'sla': '4 Hour',
        'status_realtime': 'Normal',
        'status_ladder': 'Normal',
        'latitude': -6.182341,
        'longitude': 106.828452,
        'temperature': 28.4,
        'humidity': 58.1,
        'vac_l1': 218.40, 'vac_l2': 220.30, 'vdc': 53.8, 'load_cur': 45.2, 'total_pwr': 2.43,
        'b1_v': 53.50, 'b2_v': 53.60, 'b3_v': 53.40,
        'pln_v': 219.0, 'pln_i': 12.8, 'pln_f': 49.9, 'pln_status': 'Normal',
        'genset_status': 'Mati', 'fuel_liter': 160.0, 'solar_v': 64.2, 'solar_i': 11.5, 'solar_p': 738.3
    },
    {
        'site_name': 'NYK_SUBANG_NODE',
        'project_id': '23XL05C0019',
        'ladder': 'Ladder-1',
        'sla': '2 Hour',
        'status_realtime': 'Normal',
        'status_ladder': 'Normal',
        'latitude': -6.571589,
        'longitude': 107.758736,
        'temperature': 30.1,
        'humidity': 67.4,
        'vac_l1': 219.0, 'vac_l2': 218.0, 'vdc': 54.2, 'load_cur': 55.0, 'total_pwr': 2.98,
        'b1_v': 53.60, 'b2_v': 53.55, 'b3_v': 53.62,
        'pln_v': 220.2, 'pln_i': 13.9, 'pln_f': 50.0, 'pln_status': 'Normal',
        'genset_status': 'Mati', 'fuel_liter': 135.0, 'solar_v': 67.0, 'solar_i': 13.0, 'solar_p': 871.0
    },
    {
        'site_name': 'NYK_BANDUNG_HUB',
        'project_id': '23XL05C0035',
        'ladder': 'Ladder-1',
        'sla': '2 Hour',
        'status_realtime': 'Warning',
        'status_ladder': 'Over',
        'latitude': -6.914744,
        'longitude': 107.609810,
        'temperature': 36.8,
        'humidity': 72.0,
        'vac_l1': 198.50, 'vac_l2': 202.10, 'vdc': 53.2, 'load_cur': 78.4, 'total_pwr': 4.17,
        'b1_v': 52.40, 'b2_v': 52.80, 'b3_v': 52.10,
        'pln_v': 202.0, 'pln_i': 18.4, 'pln_f': 49.6, 'pln_status': 'Unstable',
        'genset_status': 'Standby', 'fuel_liter': 65.0, 'solar_v': 58.0, 'solar_i': 8.4, 'solar_p': 487.2
    },
    {
        'site_name': 'NYK_SEMARANG_SITE',
        'project_id': '23XL05C0051',
        'ladder': 'Ladder-2',
        'sla': '2 Hour',
        'status_realtime': 'Normal',
        'status_ladder': 'Under',
        'latitude': -6.993200,
        'longitude': 110.420300,
        'temperature': 29.8,
        'humidity': 60.3,
        'vac_l1': 215.30, 'vac_l2': 219.00, 'vdc': 53.9, 'load_cur': 58.6, 'total_pwr': 3.16,
        'b1_v': 53.40, 'b2_v': 53.50, 'b3_v': 53.30,
        'pln_v': 221.0, 'pln_i': 14.5, 'pln_f': 50.0, 'pln_status': 'Normal',
        'genset_status': 'Mati', 'fuel_liter': 150.0, 'solar_v': 69.2, 'solar_i': 13.8, 'solar_p': 955.0
    },
    {
        'site_name': 'NYK_SURABAYA_NODE',
        'project_id': '23XL05C0044',
        'ladder': 'Ladder-3',
        'sla': '4 Hour',
        'status_realtime': 'Normal',
        'status_ladder': 'Normal',
        'latitude': -7.257472,
        'longitude': 112.752088,
        'temperature': 31.2,
        'humidity': 64.5,
        'vac_l1': 222.10, 'vac_l2': 224.00, 'vdc': 54.1, 'load_cur': 52.0, 'total_pwr': 2.81,
        'b1_v': 53.70, 'b2_v': 53.65, 'b3_v': 53.72,
        'pln_v': 222.5, 'pln_i': 13.2, 'pln_f': 50.1, 'pln_status': 'Normal',
        'genset_status': 'Mati', 'fuel_liter': 175.0, 'solar_v': 70.4, 'solar_i': 14.5, 'solar_p': 1020.8
    }
]

# Delete old data
RectifierData.objects.all().delete()

for s in sites:
    modules_status = [
        {'id': 1, 'status': 'Normal' if s['status_realtime'] == 'Normal' else 'Fault', 'value': 'LK23290...'},
        {'id': 2, 'status': 'Normal' if s['status_realtime'] == 'Normal' else 'Protect', 'value': 'LK23140...'},
        {'id': 3, 'status': 'Normal', 'value': 'LK23140...'},
        {'id': 4, 'status': 'Normal', 'value': 'LK23290...'},
        {'id': 5, 'status': 'AC Off', 'value': '-'},
        {'id': 6, 'status': 'AC Off', 'value': '-'},
    ]

    RectifierData.objects.create(
        timestamp=int(time.time() * 1000),
        site_name=s['site_name'],
        project_id=s['project_id'],
        ladder=s['ladder'],
        sla=s['sla'],
        status_realtime=s['status_realtime'],
        status_ladder=s['status_ladder'],
        latitude=s['latitude'],
        longitude=s['longitude'],
        door_cabinet='Close',
        battery_stolen='Close',
        temperature=s['temperature'],
        humidity=s['humidity'],
        vac_input_l1=s['vac_l1'],
        vac_input_l2=s['vac_l2'],
        vac_input_l3=None,
        vdc_output=s['vdc'],
        battery_current=0.0,
        iac_input_l1=None,
        iac_input_l2=None,
        iac_input_l3=None,
        load_current=s['load_cur'],
        load_power=s['total_pwr'],
        pac_load_l1=1.0,
        pac_load_l2=1.0,
        pac_load_l3=1.0,
        rectifier_current=s['load_cur'],
        total_power=s['total_pwr'],
        battery_bank_1_voltage=s['b1_v'],
        battery_bank_1_current=0.0,
        battery_bank_1_soc=100.0,
        battery_bank_1_soh=100.0,
        battery_bank_2_voltage=s['b2_v'],
        battery_bank_2_current=0.0,
        battery_bank_2_soc=100.0,
        battery_bank_2_soh=100.0,
        battery_bank_3_voltage=s['b3_v'],
        battery_bank_3_current=0.0,
        battery_bank_3_soc=100.0,
        battery_bank_3_soh=100.0,
        backup_duration=None,
        time_remaining=None,
        battery_status='Standby',
        start_backup='No data',
        soc_avg=100.0,
        modules_status=modules_status,
        pln_voltage=s['pln_v'],
        pln_current=s['pln_i'],
        pln_frequency=s['pln_f'],
        pln_status=s['pln_status'],
        genset_status=s['genset_status'],
        genset_voltage=220.0 if s['genset_status'] == 'Hidup' else 0.0,
        genset_current=14.0 if s['genset_status'] == 'Hidup' else 0.0,
        genset_frequency=50.0 if s['genset_status'] == 'Hidup' else 0.0,
        fuel_level_liter=s['fuel_liter'],
        fuel_capacity_liter=200.0,
        mppt_pv_voltage=s['solar_v'],
        mppt_pv_current=s['solar_i'],
        mppt_pv_power=s['solar_p'],
        mppt_daily_energy=5.2
    )

print(f"✓ Berhasil membuat sample data untuk {RectifierData.objects.count()} site!")
