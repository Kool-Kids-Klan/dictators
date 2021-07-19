import json
import asyncio

from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from channels.exceptions import StopConsumer

from dictators.dictators_game.services.user_manager import get_user
from dictators.dictators_game.services.lobby_service import temp_lobby
from dictators.dictators_game.services.game_logic import Game, GAMES
from dictators.dictators_game.services.lobby_service import Lobby, LOBBIES

TICK = 0.5


class DictatorsConsumer(AsyncJsonWebsocketConsumer):
    def __init__(self):
        super(DictatorsConsumer, self).__init__()
        self.room_name = ''
        self.room_group_name = ''
        self.task = None
        self.lobby = None
        self.game = None
        self.game_map = None

    async def tick(self):
        while True:
            print('ticking')
            self.game = GAMES[self.room_name]
            self.lobby = LOBBIES[self.room_name]
            game_tick = await sync_to_async(self.game.tick)()
            # print(game_tick)

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

            if not self.lobby.get_all_players():
                del LOBBIES[self.room_name]
                del GAMES[self.room_name]
                await self.disconnect(1000)

            print('tick is happening')
            await asyncio.sleep(TICK)

    def stop_tick(self):
        print('stopping tick')
        if self.task:
            self.task.cancel()

    async def start_game(self):
        # self.game = await sync_to_async(Game)(self.lobby.get_all_players(), 16, 8, 0)
        self.game = GAMES[self.room_name]
        await self.channel_layer.group_send(self.room_group_name, {
            'type': 'send_message',
            'message': '',
            'event': 'START'
        })

        # loop = asyncio.get_event_loop()
        # self.task = loop.create_task(self.tick())

    @database_sync_to_async
    def get_user_db(self, username):
        return get_user(username)

    async def add_user_to_lobby(self, user):
        self.lobby.add_player(user)
        player_dict = [player.as_json() for player in self.lobby.get_all_players()]
        print('this are players that are joined in one lobby', player_dict)
        await self.channel_layer.group_send(self.room_group_name, {
            'type': 'send_message',
            'message': {'players': player_dict, 'id': self.room_name},
            'event': 'JOIN_USER'
        })

        await self.channel_layer.group_add(
            user.username,
            self.channel_name
        )

    async def create_lobby(self, username):
        user = await self.get_user_db(username)
        self.lobby = Lobby()
        LOBBIES[self.room_name] = self.lobby
        await self.add_user_to_lobby(user)

    async def join_user_to_lobby(self, username):
        user = await self.get_user_db(username)
        self.lobby = LOBBIES[self.room_name]
        await self.add_user_to_lobby(user)

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
            self.game = await sync_to_async(Game)(self.lobby.get_all_players(), 30, 16, 8, 64)
            GAMES[self.room_name] = self.game
            # await self.channel_layer.group_send(self.lobby.players.user.username, {
            #     'type': 'send_message',
            #     'message': '',
            #     'event': 'START_TICKING_BRO',
            # })
            await self.send_json({
                'payload': {
                    'message': '',
                    'event': 'START_TICKING_BRO',
                }
            })
            # await self.start_game()
            await self.channel_layer.group_send(self.room_group_name, {
                'type': 'send_start',
                'message': '',
                'event': '',
            })
            # await self.start_game()

    async def user_not_ready(self, username):
        user = await self.get_user_db(username)
        player = self.lobby.get_player(user)
        player.ready = False
        await self.channel_layer.group_send(self.room_group_name, {
            'type': 'send_message',
            'message': player.as_json(),
            'event': 'USER_NOT_READY'
        })

    async def user_exit_lobby(self, username):
        user = await self.get_user_db(username)
        self.lobby.remove_player(user)
        # lobby is empty, remove lobby
        # if not self.lobby.get_all_players():
        #     del LOBBIES[self.room_name]

        await self.disconnect(3)

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
        # self.lobby = Lobby()
        # LOBBIES.append({self.room_name: self.lobby})

    async def disconnect(self, close_code):
        print("Disconnected")
        # Leave room group
        self.stop_tick()
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        await self.close(1000)

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

        # if event == 'START_GAME':
        #     await self.start_game()
        #     game_map = []
        #     loop = asyncio.get_event_loop()
        #     self.task = loop.create_task(self.tick(game_map))

        if event == 'JOIN_ROOM':
            if self.room_name not in LOBBIES.keys():
                await self.disconnect(1000)
            else:
                await self.join_user_to_lobby(message)

        if event == 'CREATE_ROOM':
            await self.create_lobby(message)

        if event == 'GET_READY':
            await self.user_get_ready(message)

        if event == 'NOT_READY':
            await self.user_not_ready(message)

        if event == 'EXIT_LOBBY':
            await self.user_exit_lobby(message)

        if event == 'MAKE_MOVE':
            await self.make_move(message)

        if event == 'START_TICK':
            loop = asyncio.get_event_loop()
            self.task = loop.create_task(self.tick())

    async def send_start(self, res):
        await self.start_game()

    async def send_message(self, res):
        """ Receive message from room group """
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            "payload": res,
        }))