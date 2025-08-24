import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer


class StoryFeedConsumer(AsyncJsonWebsocketConsumer):
    group_name = "stories"

    async def connect(self):
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive_json(self, content, **kwargs):
        # This feed is broadcast-only; ignore client messages or implement ping/pong
        pass

    async def story_event(self, event):
        # event expected: { "type": "story.event", "data": {...} }
        await self.send_json(event.get("data", {}))
