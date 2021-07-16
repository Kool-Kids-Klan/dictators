import json
import asyncio

from channels.generic.websocket import AsyncJsonWebsocketConsumer

from dictators.dictators_game.services.map_generator import generate_map


class DictatorsConsumer(AsyncJsonWebsocketConsumer):
    def __init__(self):
        super(DictatorsConsumer, self).__init__()
        print('init is called')

    async def tick(self, game_map):
        while True:
            await self.send_json(content={'payload': {'message': 'hello', 'event': 'TICK'}})
            print('this is happening')
            await asyncio.sleep(5)

    @staticmethod
    async def map_to_json(game_map):
        map_dict = []
        for row in game_map:
            row_dict = []
            for tile in row:
                tile_dict = {
                    'army': tile.army,
                    'owner': tile.owner,
                    'terrain': tile.terrain
                }
                row_dict.append(tile_dict)
            map_dict.append(row_dict)

        return map_dict

    async def connect(self):
        print('User is trying to connect to room')

        print('this is scope', self.scope)

        self.room_name = self.scope['url_route']['kwargs']['room_code']
        self.room_group_name = f'room_{self.room_name}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

        game_map = generate_map(16, 4, 8, 0)
        # print('This is generated map', game_map)
        # print(await self.map_to_json(game_map))

        await self.send_json(content={'payload': {'message': await self.map_to_json(game_map),
                                                  'event': 'GAME_BOARD'}})
        await self.tick(game_map)

    async def disconnect(self, close_code):
        print("Disconnected")
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        """
        Receive message from WebSocket.
        Get the event and send the appropriate event
        """
        response = json.loads(text_data)
        event = response.get("event", None)
        message = response.get("message", None)
        if event == 'MOVE':
            # Send message to room group
            await self.channel_layer.group_send(self.room_group_name, {
                'type': 'send_message',
                'message': message,
                "event": "MOVE"
            })

        if event == 'START':
            # Send message to room group
            await self.channel_layer.group_send(self.room_group_name, {
                'type': 'send_message',
                'message': message,
                'event': "START"
            })

        if event == 'END':
            # Send message to room group
            await self.channel_layer.group_send(self.room_group_name, {
                'type': 'send_message',
                'message': message,
                'event': "END"
            })

    async def send_message(self, res):
        """ Receive message from room group """
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            "payload": res,
        }))