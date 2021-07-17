import json
import asyncio

from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async

from dictators.dictators_game.services.map_generator import generate_map
from dictators.dictators_game.services.user_manager import get_user
from dictators.dictators_game.services.lobby_service import temp_lobby


class DictatorsConsumer(AsyncJsonWebsocketConsumer):
    def __init__(self):
        super(DictatorsConsumer, self).__init__()
        self.room_name = ''
        self.room_group_name = ''
        self.task = None
        self.lobby = temp_lobby

    async def tick(self, game_map):
        while True:
        #     await self.send_json(content={'payload': {'message': 'hello', 'event': 'TICK'}})
            await self.channel_layer.group_send(self.room_group_name, {
                'type': 'send_message',
                'message': '',
                'event': 'TICK'
            })
            print('tick is happening')
            await asyncio.sleep(5)

    def stop_tick(self):
        print('stopping tick')
        if self.task:
            self.task.cancel()

    @staticmethod
    def map_to_json(game_map):
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

    async def start_game(self):
        game_map = await sync_to_async(generate_map)(16, 4, 8, 0)
        game_map_json = self.map_to_json(game_map)
        await self.channel_layer.group_send(self.room_group_name, {
            'type': 'send_message',
            'message': game_map_json,
            'event': 'LOAD_MAP'
        })
        # await self.tick(game_map)

    @database_sync_to_async
    def get_user_db(self, username):
        return get_user(username)

    async def add_user_to_lobby(self, username):
        # my_user = {'name': 'revolko', 'color': 'red'}
        user = await self.get_user_db(username)
        self.lobby.add_player(user)
        player = self.lobby.get_player(user)
        player_dict = {'name': player.user.username, 'color': player.color, 'ready': player.ready}
        await self.channel_layer.group_send(self.room_group_name, {
            'type': 'send_message',
            'message': player_dict,
            'event': 'JOIN_USER'
        })

    async def user_get_ready(self, username):
        user = await self.get_user_db(username)
        player = self.lobby.get_player(user)
        player.ready = True
        player_dict = {'username': player.user.username, 'color': player.color, 'ready': player.ready}
        await self.channel_layer.group_send(self.room_group_name, {
            'type': 'send_message',
            'message': player_dict,
            'event': 'USER_READY'
        })

    async def connect(self):
        print('User is trying to connect to room')

        # print('this is scope', self.scope)

        self.room_name = self.scope['url_route']['kwargs']['room_code']
        self.room_group_name = f'room_{self.room_name}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

        # await self.add_user_to_lobby()
        # game_map = generate_map(16, 4, 8, 0)
        # print('This is generated map', game_map)
        # print(await self.map_to_json(game_map))

        # await self.send_json(content={'payload': {'message': await self.map_to_json(game_map),
        #                                           'event': 'GAME_BOARD'}})
        # await self.tick(game_map)

    async def disconnect(self, close_code):
        print("Disconnected")
        # Leave room group
        self.stop_tick()
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

        if event == 'START_GAME':
            print('should start the game')
            await self.start_game()
            game_map = []
            loop = asyncio.get_event_loop()
            self.task = loop.create_task(self.tick(game_map))

        if event == 'JOIN_ROOM':
            await self.add_user_to_lobby(message)

        if event == 'GET_READY':
            await self.user_get_ready(message)

    async def send_message(self, res):
        """ Receive message from room group """
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            "payload": res,
        }))