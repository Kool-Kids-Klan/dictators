import random
from typing import List
from collections import deque

from dictators.dictators_game.models import User
from dictators.dictators_game.services.map_generator import CAPITAL_STARTING_ARMY


PLAYER_COLORS = ["red", "blue", "green", "purple"]
MAX_PLAYERS = 4
LOBBIES = []


class Player:
    def __init__(self, user, color):
        self.user: User = user
        self.color = color
        self.ready = False

        self.alive = True
        self.total_army = CAPITAL_STARTING_ARMY
        self.total_land = 1
        self.premoves = deque()

    def as_json(self):
        return {
            'name': self.user.username,
            'color': self.color,
            'ready': self.ready
        }

    def get_username(self):
        return self.user.username


class Lobby:
    def __init__(self):
        self.players: List[Player] = []
        self.game_started: bool = False
        self.free_colors: List[str] = PLAYER_COLORS[:]
        random.shuffle(self.free_colors)

    def _get_users(self) -> List[User]:
        return [player.user for player in self.players]

    def get_player(self, user: User) -> Player:
        # assuming that the given user is connected in the lobby
        return [player for player in self.players if player.user == user][0]

    def get_all_players(self) -> List[Player]:
        return self.players

    def add_player(self, user: User) -> bool:
        # check if user isn't already in lobby and if MAX_PLAYERS isn't exceeded
        if user not in self._get_users() and len(self.players) < MAX_PLAYERS:
            self.players.append(Player(user, self.free_colors.pop()))
            return True
        return False

    def remove_player(self, user: User):
        player = [player for player in self.players if player.user == user][0]
        self.free_colors.append(player.color)
        self.players.remove(player)

    def all_ready(self):
        return all(player.ready for player in self.players)


temp_lobby = Lobby()
