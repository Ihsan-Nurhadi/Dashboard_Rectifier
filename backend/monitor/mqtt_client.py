import json
import logging
import paho.mqtt.client as mqtt
from django.conf import settings
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .models import RectifierData

logger = logging.getLogger(__name__)

class MQTTClient:
    """MQTT Client untuk subscribe data rectifier"""
    
    def __init__(self):
        self.client = mqtt.Client(client_id=settings.MQTT_CLIENT_ID)
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.on_disconnect = self.on_disconnect
        self.channel_layer = get_channel_layer()
        
    def on_connect(self, client, userdata, flags, rc):
        """Callback ketika koneksi ke broker berhasil"""
        if rc == 0:
            logger.info(f"Connected to MQTT Broker: {settings.MQTT_BROKER}")
            client.subscribe(settings.MQTT_TOPIC)
            logger.info(f"Subscribed to topic: {settings.MQTT_TOPIC}")
        else:
            logger.error(f"Failed to connect to MQTT Broker, return code: {rc}")
    
    def on_disconnect(self, client, userdata, rc):
        """Callback ketika disconnect dari broker"""
        if rc != 0:
            logger.warning("Unexpected disconnection from MQTT Broker")
    
    def on_message(self, client, userdata, msg):
        """Callback ketika menerima message dari MQTT"""
        try:
            # Parse JSON payload
            payload = json.loads(msg.payload.decode())
            logger.info(f"Received message from MQTT")
            
            # Extract data
            ts = payload.get('ts')
            
            # Create RectifierData object with all fields
            rectifier_data = RectifierData.objects.create(
                timestamp=ts,
                
                # Site Info
                site_name=payload.get('site_name', ''),
                project_id=payload.get('project_id', ''),
                ladder=payload.get('ladder', ''),
                sla=payload.get('sla', ''),
                status_realtime=payload.get('status_realtime', 'Normal'),
                status_ladder=payload.get('status_ladder', 'Normal'),
                latitude=payload.get('latitude'),
                longitude=payload.get('longitude'),
                
                # Environment
                door_cabinet=payload.get('door_cabinet', 'Close'),
                battery_stolen=payload.get('battery_stolen', 'Close'),
                temperature=payload.get('temperature', 0),
                humidity=payload.get('humidity', 0),
                
                # Rectifier Status
                vac_input_l1=payload.get('vac_input_l1', 0),
                vac_input_l2=payload.get('vac_input_l2', 0),
                vac_input_l3=payload.get('vac_input_l3'),
                vdc_output=payload.get('vdc_output', 0),
                battery_current=payload.get('battery_current', 0),
                iac_input_l1=payload.get('iac_input_l1'),
                iac_input_l2=payload.get('iac_input_l2'),
                iac_input_l3=payload.get('iac_input_l3'),
                load_current=payload.get('load_current', 0),
                load_power=payload.get('load_power', 0),
                pac_load_l1=payload.get('pac_load_l1', 0),
                pac_load_l2=payload.get('pac_load_l2', 0),
                pac_load_l3=payload.get('pac_load_l3', 0),
                rectifier_current=payload.get('rectifier_current', 0),
                total_power=payload.get('total_power', 0),
                
                # Battery Banks
                battery_bank_1_voltage=payload.get('battery_bank_1_voltage', 0),
                battery_bank_1_current=payload.get('battery_bank_1_current', 0),
                battery_bank_1_soc=payload.get('battery_bank_1_soc', 100),
                battery_bank_1_soh=payload.get('battery_bank_1_soh', 100),
                
                battery_bank_2_voltage=payload.get('battery_bank_2_voltage', 0),
                battery_bank_2_current=payload.get('battery_bank_2_current', 0),
                battery_bank_2_soc=payload.get('battery_bank_2_soc', 100),
                battery_bank_2_soh=payload.get('battery_bank_2_soh', 100),
                
                battery_bank_3_voltage=payload.get('battery_bank_3_voltage', 0),
                battery_bank_3_current=payload.get('battery_bank_3_current', 0),
                battery_bank_3_soc=payload.get('battery_bank_3_soc', 100),
                battery_bank_3_soh=payload.get('battery_bank_3_soh', 100),
                
                # Battery Status
                backup_duration=payload.get('backup_duration'),
                time_remaining=payload.get('time_remaining'),
                battery_status=payload.get('battery_status', 'Standby'),
                start_backup=payload.get('start_backup', 'No data'),
                soc_avg=payload.get('soc_avg', 100),
                
                # Modules Status
                modules_status=payload.get('modules_status', []),
            )
            
            logger.info(f"Data saved to database: {rectifier_data.id}")
            
            # Broadcast to WebSocket clients (if available)
            try:
                if self.channel_layer:
                    async_to_sync(self.channel_layer.group_send)(
                        'rectifier_data',
                        {
                            'type': 'rectifier_update',
                            'data': {
                                'timestamp': ts,
                                'site_name': payload.get('site_name', ''),
                                'vdc_output': payload.get('vdc_output', 0),
                                'load_current': payload.get('load_current', 0),
                                'temperature': payload.get('temperature', 0),
                                'status_realtime': payload.get('status_realtime', 'Normal'),
                            }
                        }
                    )
                    logger.info("Data broadcasted to WebSocket clients")
                else:
                    logger.debug("WebSocket channel layer not available (OK - using REST API polling)")
            except Exception as ws_error:
                logger.warning(f"WebSocket broadcast failed (OK - using REST API polling): {ws_error}")
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to decode JSON: {e}")
        except Exception as e:
            logger.error(f"Error processing message: {e}")
    
    def connect(self):
        """Koneksi ke MQTT broker"""
        try:
            self.client.connect(settings.MQTT_BROKER, settings.MQTT_PORT, 60)
            self.client.loop_start()
            logger.info("MQTT Client started")
        except Exception as e:
            logger.error(f"Failed to start MQTT client: {e}")
    
    def disconnect(self):
        """Disconnect dari MQTT broker"""
        self.client.loop_stop()
        self.client.disconnect()
        logger.info("MQTT Client stopped")

# Global MQTT client instance
mqtt_client = None

def start_mqtt_client():
    """Start MQTT client"""
    global mqtt_client
    if mqtt_client is None:
        mqtt_client = MQTTClient()
        mqtt_client.connect()
    return mqtt_client

def stop_mqtt_client():
    """Stop MQTT client"""
    global mqtt_client
    if mqtt_client is not None:
        mqtt_client.disconnect()
        mqtt_client = None
