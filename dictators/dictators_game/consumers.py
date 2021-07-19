import json
import asyncio

from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async

from dictators.dictators_game.services.user_manager import get_user
from dictators.dictators_game.services.lobby_service import temp_lobby
from dictators.dictators_game.services.game_logic import Game

TICK = 5


class DictatorsConsumer(AsyncJsonWebsocketConsumer):
    def __init__(self):
        super(DictatorsConsumer, self).__init__()
        self.room_name = ''
        self.room_group_name = ''
        self.task = None
        self.lobby = temp_lobby
        self.game = None
        self.game_map = None

    async def tick(self):
        while True:
            print('ticking')
            game_tick = await sync_to_async(self.game.tick)()
            print(game_tick)

            for player in self.lobby.get_all_players():
                player_name = player.user.username
                await self.channel_layer.group_send(player_name, {
                    'type': 'send_message',
                    'message': {
                        'map': game_tick['maps'][player_name],
                        'scoreboard': game_tick['scoreboard'],
                        'winner': game_tick['winner'],
                        'premoves': game_tick['premoves'][player_name]
                    },
                    'event': 'TICK'
                })

            print('tick is happening')
            await asyncio.sleep(TICK)

    def stop_tick(self):
        print('stopping tick')
        if self.task:
            self.task.cancel()

    async def start_game(self):
        self.game = await sync_to_async(Game)(self.lobby.get_all_players(), 16, 8, 0)

        await self.channel_layer.group_send(self.room_group_name, {
            'type': 'send_message',
            'message': '',
            'event': 'START'
        })

        loop = asyncio.get_event_loop()
        self.task = loop.create_task(self.tick())

    @database_sync_to_async
    def get_user_db(self, username):
        return get_user(username)

    async def add_user_to_lobby(self, username):
        user = await self.get_user_db(username)
        self.lobby.add_player(user)
        player_dict = [player.as_json() for player in self.lobby.get_all_players()]
        await self.channel_layer.group_send(self.room_group_name, {
            'type': 'send_message',
            'message': {'players': player_dict, 'id': self.room_name},
            'event': 'JOIN_USER'
        })

        await self.channel_layer.group_add(
            user.username,
            self.channel_name
        )

    async def user_get_ready(self, username):
        user = await self.get_user_db(username)
        player = self.lobby.get_player(user)
        player.ready = True
        await self.channel_layer.group_send(self.room_group_name, {
            'type': 'send_message',
            'message': player.as_json(),
            'event': 'USER_READY'
        })
        if self.lobby.all_ready():
            await self.start_game()

    async def user_not_ready(self, username):
        user = await self.get_user_db(username)
        player = self.lobby.get_player(user)
        player.ready = False
        await self.channel_layer.group_send(self.room_group_name, {
            'type': 'send_message',
            'message': player.as_json(),
            'event': 'USER_NOT_READY'
        })

    async def make_move(self, message):
        action = message['key']
        username = message['username']
        from_tile = (message['coor'][1], message['coor'][0])
        self.game.submit_move(username, from_tile, action)

    async def connect(self):
        print('User is trying to connect to room')

        self.room_name = self.scope['url_route']['kwargs']['room_code']
        self.room_group_name = f'room_{self.room_name}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

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
            await self.start_game()
            game_map = []
            loop = asyncio.get_event_loop()
            self.task = loop.create_task(self.tick(game_map))

        if event == 'JOIN_ROOM':
            await self.add_user_to_lobby(message)

        if event == 'GET_READY':
            await self.user_get_ready(message)

        if event == 'NOT_READY':
            await self.user_not_ready(message)

        if event == 'MAKE_MOVE':
            await self.make_move(message)

    async def send_message(self, res):
        """ Receive message from room group """
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            "payload": res,
        }))