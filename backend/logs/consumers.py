from channels.generic.websocket import AsyncWebsocketConsumer
import json


class LogConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("WebSocket connecting...")
        await self.channel_layer.group_add("logs", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("logs", self.channel_name)

    async def send_log(self, event):
        await self.send(text_data=json.dumps(event["log"]))
