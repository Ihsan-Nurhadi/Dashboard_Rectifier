#!/usr/bin/env python3
"""
Script untuk publish test data ke MQTT broker
Gunakan script ini untuk testing dashboard tanpa hardware rectifier
"""

import json
import time
import random
import paho.mqtt.client as mqtt

# MQTT Configuration
MQTT_BROKER = "broker.emqx.io"  # Ganti dengan broker Anda
MQTT_PORT = 1883
MQTT_TOPIC = "rectifier/data"
MQTT_CLIENT_ID = f"test_publisher_{random.randint(1000, 9999)}"  # Unique client ID

# Alternative public brokers (uncomment untuk coba broker lain):
# MQTT_BROKER = "test.mosquitto.org"
# MQTT_BROKER = "broker.hivemq.com"
# MQTT_BROKER = "mqtt.eclipseprojects.io"

def generate_test_data():
    """Generate random test data untuk rectifier"""
    timestamp = int(time.time() * 1000)
    
    # Generate realistic values
    bus_volt = random.randint(5200, 5400)  # 52-54V
    load_curr = random.randint(0, 3000)     # 0-30A
    ac_volt = random.randint(21500, 22500)  # 215-225V
    ac_curr = random.randint(0, 1000)       # 0-10A
    
    data = {
        "ts": timestamp,
        "host": "test-rectifier-01",
        "data": [
            {"key": "rectifier.data.bus_volt", "val": str(bus_volt)},
            {"key": "rectifier.data.load_curr", "val": str(load_curr)},
            {"key": "rectifier.data.ac_volt_l1", "val": str(ac_volt)},
            {"key": "rectifier.data.ac_CURR_l1", "val": str(ac_curr)}
        ]
    }
    
    return data

def on_connect(client, userdata, flags, rc):
    """Callback ketika koneksi ke broker"""
    if rc == 0:
        print(f"✓ Connected to MQTT Broker: {MQTT_BROKER}")
        print(f"✓ Publishing to topic: {MQTT_TOPIC}")
        print("✓ Press Ctrl+C to stop\n")
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
            print("   - Check credentials if using private broker")
        elif rc == 5:
            print("   - Try different Client ID (already random)")
            print("   - Try different broker (uncomment alternatives in script)")
            print("   - Check firewall/antivirus settings")
        print("\n🔄 Trying to reconnect in 5 seconds...")
        time.sleep(5)

def on_publish(client, userdata, mid):
    pass

def main():
    print("=" * 60)
    print("Rectifier MQTT Test Data Publisher")
    print("=" * 60)
    
    # Create MQTT client
    client = mqtt.Client(client_id=MQTT_CLIENT_ID)
    client.on_connect = on_connect
    client.on_publish = on_publish
    
    try:
        # Connect to broker
        print(f"Connecting to {MQTT_BROKER}:{MQTT_PORT}...")
        client.connect(MQTT_BROKER, MQTT_PORT, 60)
        client.loop_start()
        
        # Publish data every 2 seconds
        count = 0
        while True:
            count += 1
            data = generate_test_data()
            payload = json.dumps(data)
            
            result = client.publish(MQTT_TOPIC, payload)
            
            if result.rc == mqtt.MQTT_ERR_SUCCESS:
                bus_v = float(data['data'][0]['val']) / 100
                load_a = float(data['data'][1]['val']) / 100
                ac_v = float(data['data'][2]['val']) / 100
                ac_a = float(data['data'][3]['val']) / 100
                
                print(f"[{count}] Published - Bus: {bus_v:.2f}V | Load: {load_a:.2f}A | AC: {ac_v:.2f}V | AC: {ac_a:.2f}A")
            else:
                print(f"[{count}] Failed to publish, error code: {result.rc}")
            
            time.sleep(2)
            
    except KeyboardInterrupt:
        print("\n\nStopping publisher...")
    except Exception as e:
        print(f"\nError: {e}")
    finally:
        client.loop_stop()
        client.disconnect()
        print("Disconnected from MQTT broker")

if __name__ == "__main__":
    main()
