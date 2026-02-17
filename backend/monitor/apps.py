from django.apps import AppConfig

class MonitorConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'monitor'
    
    def ready(self):
        """Start MQTT client ketika aplikasi ready"""
        import os
        # Only start in main process, not in migration or other commands
        if os.environ.get('RUN_MAIN') == 'true':
            from .mqtt_client import start_mqtt_client
            try:
                start_mqtt_client()
                print("✓ MQTT Client started successfully")
            except Exception as e:
                print(f"✗ Failed to start MQTT client: {e}")
