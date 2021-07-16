import json
import asyncio

from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async


class DictatorsConsumer(AsyncJsonWebsocketConsumer):
    @database_sync_to_async
    def db_tick(self, game_board):
        return game_board.tick(addition=10)

    async def tick(self, game_board):
        while True:
            await self.db_tick(game_board)
            await self.send_json(content={'payload': {'message': 'hello', 'event': 'TICK'}})
            await asyncio.sleep(5)

    @database_sync_to_async
    def create_game_board(self):
        game_board = GameBoard.objects.create(game_board=[-1, -1, -1, -1, -1, -1, -1, -1, -1])
        return game_board

    async def connect(self):
        print('User is trying to connect to room')
        print('scope is', self.scope.keys())


        self.room_name = self.scope['url_route']['kwargs']['room_code']
        self.room_group_name = f'room_{self.room_name}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

        # serializer = GameBoardSerializer(data={'game_board': [-1, -1, -1, -1, -1, -1, -1, -1, -1]})
        # serializer.is_valid(raise_exception=True)
        # game_board = serializer.save()
        game_board = await self.create_game_board()

        await self.send_json(content={'payload': {'message': game_board.as_json(), 'event': 'GAME_BOARD'}})
        await self.tick(game_board)

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