#!/usr/bin/env python3
"""
Complete MQTT Publisher untuk Dashboard Rectifier
Mengirim semua parameter yang dibutuhkan frontend Next.js
"""

import json
import time
import random
import paho.mqtt.client as mqtt
from datetime import datetime

# MQTT Configuration
MQTT_BROKER = "broker.emqx.io"
MQTT_PORT = 1883
MQTT_TOPIC = "rectifier/data"
MQTT_CLIENT_ID = f"complete_publisher_{random.randint(1000, 9999)}"

SITES_LIST = [
    {
        "site_name": "NYK_WORKSHOP",
        "project_id": "23XL05C0027",
        "ladder": "Ladder-1",
        "sla": "2 Hour",
        "latitude": -6.305489261279732,
        "longitude": 106.95865111442095,
    },
    {
        "site_name": "NYK_CENTRAL_JKT",
        "project_id": "23XL05C0012",
        "ladder": "Ladder-2",
        "sla": "4 Hour",
        "latitude": -6.182341,
        "longitude": 106.828452,
    },
    {
        "site_name": "NYK_BANDUNG_HUB",
        "project_id": "23XL05C0035",
        "ladder": "Ladder-1",
        "sla": "2 Hour",
        "latitude": -6.914744,
        "longitude": 107.609810,
    },
    {
        "site_name": "NYK_SURABAYA_NODE",
        "project_id": "23XL05C0044",
        "ladder": "Ladder-3",
        "sla": "4 Hour",
        "latitude": -7.257472,
        "longitude": 112.752088,
    },
    {
        "site_name": "NYK_SEMARANG_SITE",
        "project_id": "23XL05C0051",
        "ladder": "Ladder-2",
        "sla": "2 Hour",
        "latitude": -6.993200,
        "longitude": 110.420300,
    }
]

def generate_complete_data(site_index=None):
    """Generate data lengkap sesuai dengan struktur frontend"""
    timestamp = int(time.time() * 1000)
    
    site = SITES_LIST[site_index % len(SITES_LIST)] if site_index is not None else random.choice(SITES_LIST)
    
    # Generate realistic fluctuating values
    data = {
        "ts": timestamp,
        
        # Site Info
        "site_name": site["site_name"],
        "project_id": site["project_id"],
        "ladder": site["ladder"],
        "sla": site["sla"],
        "status_realtime": random.choice(["Normal", "Normal", "Normal", "Warning", "Alarm"]),
        "status_ladder": random.choice(["Normal", "Over", "Under"]),
        "latitude": site["latitude"],
        "longitude": site["longitude"],
        
        # Environment Status
        "door_cabinet": "Close",
        "battery_stolen": "Close",
        "temperature": round(random.uniform(31.0, 33.5), 1),
        "humidity": round(random.uniform(59.0, 64.0), 1),
        
        # Rectifier Status - AC Input
        "vac_input_l1": round(random.uniform(218.0, 223.5), 2),
        "vac_input_l2": round(random.uniform(219.0, 224.5), 2),
        "vac_input_l3": None,
        
        # Rectifier Status - DC Output
        "vdc_output": round(random.uniform(53.8, 54.2), 2),
        "battery_current": round(random.uniform(-0.1, 0.2), 2),
        
        # Rectifier Status - AC Current
        "iac_input_l1": None,
        "iac_input_l2": None,
        "iac_input_l3": None,
        
        # Rectifier Status - Load
        "load_current": round(random.uniform(58.0, 64.0), 1),
        "load_power": round(random.uniform(3.1, 3.5), 2),
        
        # Rectifier Status - Load Power
        "pac_load_l1": round(random.uniform(0.9, 1.2), 2),
        "pac_load_l2": round(random.uniform(0.9, 1.2), 2),
        "pac_load_l3": round(random.uniform(0.9, 1.2), 2),
        
        "rectifier_current": round(random.uniform(58.0, 64.0), 1),
        "total_power": round(random.uniform(3.1, 3.5), 2),
        
        # Battery Banks (3 banks)
        "battery_bank_1_voltage": round(random.uniform(53.25, 53.45), 2),
        "battery_bank_1_current": round(random.uniform(0.0, 0.2), 2),
        "battery_bank_1_soc": 100.0,
        "battery_bank_1_soh": 100.0,
        
        "battery_bank_2_voltage": round(random.uniform(53.30, 53.50), 2),
        "battery_bank_2_current": round(random.uniform(0.0, 0.2), 2),
        "battery_bank_2_soc": 100.0,
        "battery_bank_2_soh": 100.0,
        
        "battery_bank_3_voltage": round(random.uniform(53.20, 53.40), 2),
        "battery_bank_3_current": round(random.uniform(0.0, 0.2), 2),
        "battery_bank_3_soc": 100.0,
        "battery_bank_3_soh": 100.0,
        
        # Battery Status
        "backup_duration": None,
        "time_remaining": None,
        "battery_status": "Standby",
        "start_backup": "No data",
        "soc_avg": 100.0,
        
        # Module Status (6 modules)
        "modules_status": [
            {
                "id": 1,
                "status": random.choice(["Normal", "Fault", "Protect", "AC Off"]),
                "value": "LK23290..." if random.random() > 0.3 else "-"
            },
            {
                "id": 2,
                "status": random.choice(["Normal", "Fault", "Protect", "AC Off"]),
                "value": "LK23140..." if random.random() > 0.3 else "-"
            },
            {
                "id": 3,
                "status": random.choice(["Normal", "Fault", "Protect", "AC Off"]),
                "value": "LK23140..." if random.random() > 0.3 else "-"
            },
            {
                "id": 4,
                "status": random.choice(["Normal", "Fault", "Protect", "AC Off"]),
                "value": "LK23290..." if random.random() > 0.3 else "-"
            },
            {
                "id": 5,
                "status": random.choice(["Normal", "AC Off"]),
                "value": "-" if random.random() > 0.5 else "LK23290..."
            },
            {
                "id": 6,
                "status": random.choice(["Normal", "AC Off"]),
                "value": "-" if random.random() > 0.5 else "LK23290..."
            }
        ],

        # Power Meter PLN (AC)
        "pln_voltage": round(random.uniform(218.5, 222.5), 1),
        "pln_current": round(random.uniform(14.2, 15.8), 1),
        "pln_frequency": round(random.uniform(49.92, 50.08), 2),
        "pln_status": "Normal",

        # Genset & Fuel
        "genset_status": "Mati",
        "genset_voltage": 0.0,
        "genset_current": 0.0,
        "genset_frequency": 0.0,
        "fuel_level_liter": round(random.uniform(142.5, 145.0), 1),
        "fuel_capacity_liter": 200.0,

        # MPPT Solar Panel (DC)
        "mppt_pv_voltage": round(random.uniform(66.5, 70.5), 1),
        "mppt_pv_current": round(random.uniform(12.8, 14.2), 1),
        "mppt_pv_power": round(random.uniform(850.0, 950.0), 1),
        "mppt_daily_energy": round(random.uniform(5.2, 5.6), 2),
    }
    
    return data

def on_connect(client, userdata, flags, rc):
    """Callback ketika koneksi ke broker"""
    if rc == 0:
        print("=" * 70)
        print("✓ Connected to MQTT Broker")
        print(f"  Broker: {MQTT_BROKER}:{MQTT_PORT}")
        print(f"  Topic: {MQTT_TOPIC}")
        print(f"  Client ID: {MQTT_CLIENT_ID}")
        print("=" * 70)
        print("\n📊 Publishing complete dashboard data...")
        print("Press Ctrl+C to stop\n")
    else:
        error_messages = {
            1: "Connection refused - incorrect protocol version",
            2: "Connection refused - invalid client identifier",
            3: "Connection refused - server unavailable",
            4: "Connection refused - bad username or password",
            5: "Connection refused - not authorized"
        }
        error_msg = error_messages.get(rc, f"Unknown error code: {rc}")
        print(f"✗ Failed to connect: {error_msg}")
        print("\n💡 Solutions:")
        if rc == 4:
            print("   - Remove username/password if using public broker")
        elif rc == 5:
            print("   - Try different broker in script")
            print("   - Check firewall settings")

def on_publish(client, userdata, mid):
    """Callback when message is published"""
    pass

def format_data_summary(data):
    """Format summary untuk display"""
    return (
        f"Site: {data['site_name']} | "
        f"Status: {data['status_realtime']} | "
        f"Temp: {data['temperature']}°C | "
        f"VDC: {data['vdc_output']}V | "
        f"Load: {data['load_current']}A | "
        f"SOC: {data['soc_avg']}%"
    )

def main():
    print("\n" + "=" * 70)
    print("Complete MQTT Publisher for Rectifier Dashboard")
    print("=" * 70)
    print(f"\n📡 Connecting to {MQTT_BROKER}:{MQTT_PORT}...")
    
    # Create MQTT client
    client = mqtt.Client(client_id=MQTT_CLIENT_ID)
    client.on_connect = on_connect
    client.on_publish = on_publish
    
    try:
        # Connect to broker
        client.connect(MQTT_BROKER, MQTT_PORT, 60)
        client.loop_start()
        
        # Wait for connection
        time.sleep(2)
        
        # Publish data every 2 seconds
        count = 0
        while True:
            count += 1
            data = generate_complete_data(count)
            payload = json.dumps(data, indent=2)
            
            result = client.publish(MQTT_TOPIC, payload, qos=1)
            
            if result.rc == mqtt.MQTT_ERR_SUCCESS:
                timestamp = datetime.now().strftime("%H:%M:%S")
                print(f"[{timestamp}] #{count} ✓ {format_data_summary(data)}")
            else:
                print(f"[{count}] ✗ Failed to publish (error: {result.rc})")
            
            time.sleep(2)
            
    except KeyboardInterrupt:
        print("\n\n" + "=" * 70)
        print("Stopping publisher...")
        print(f"Total messages published: {count}")
        print("=" * 70)
    except Exception as e:
        print(f"\n✗ Error: {e}")
    finally:
        client.loop_stop()
        client.disconnect()
        print("Disconnected from MQTT broker\n")

if __name__ == "__main__":
    main()
