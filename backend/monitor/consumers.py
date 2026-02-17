import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import RectifierData

class RectifierConsumer(AsyncWebsocketConsumer):
    """WebSocket consumer untuk real-time data rectifier"""
    
    async def connect(self):
        """Handle WebSocket connection"""
        self.room_group_name = 'rectifier_data'
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Send latest data on connection
        latest_data = await self.get_latest_data()
        if latest_data:
            await self.send(text_data=json.dumps({
                'type': 'initial_data',
                'data': latest_data
            }))
    
    async def disconnect(self, close_code):
        """Handle WebSocket disconnection"""
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    async def receive(self, text_data):
        """Handle messages from WebSocket"""
        try:
            data = json.loads(text_data)
            message_type = data.get('type', 'unknown')
            
            if message_type == 'request_latest':
                latest_data = await self.get_latest_data()
                await self.send(text_data=json.dumps({
                    'type': 'latest_data',
                    'data': latest_data
                }))
        except json.JSONDecodeError:
            pass
    
    async def rectifier_update(self, event):
        """Handle rectifier update from MQTT"""
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'rectifier_update',
            'data': event['data']
        }))
    
    @database_sync_to_async
    def get_latest_data(self):
        """Get latest data from database"""
        try:
            latest = RectifierData.objects.first()
            if latest:
                return {
                    'timestamp': latest.timestamp,
                    'host': latest.host,
                    'bus_volt': latest.bus_volt,
                    'load_curr': latest.load_curr,
                    'ac_volt_l1': latest.ac_volt_l1,
                    'ac_curr_l1': latest.ac_curr_l1,
                }
        except RectifierData.DoesNotExist:
            pass
        return None
