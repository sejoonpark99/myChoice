import json
from channels.generic.websocket import AsyncWebsocketConsumer


class ItemConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Join the 'items' group
        self.group_name = "items"

        await self.channel_layer.group_add(self.group_name, self.channel_name)

        await self.accept()
        print(f"WebSocket connected: {self.channel_name}")

    async def disconnect(self, close_code):
        # Leave the 'items' group
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        print(f"WebSocket disconnected: {self.channel_name}")

    # Handle messages from WebSocket (client to server)
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get("type")

        # For now, just echo back
        await self.send(
            text_data=json.dumps(
                {"type": "echo", "message": f"Received: {message_type}"}
            )
        )

    # Handle messages from group (server to client)
    async def item_created(self, event):
        await self.send(text_data=json.dumps(event))

    async def item_updated(self, event):
        await self.send(text_data=json.dumps(event))

    async def item_deleted(self, event):
        await self.send(text_data=json.dumps(event))

    async def items_bulk_deleted(self, event):
        await self.send(text_data=json.dumps(event))
