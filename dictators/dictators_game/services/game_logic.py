from typing import List, Dict
import random

from dictators.dictators_game.services.map_generator import generate_map
from dictators.dictators_game.services.lobby_service import Player


class Game:
    def __init__(self,
                 players: List[Player],
                 map_size: int,
                 n_barracks: int,
                 n_mountains: int):
        self.players = players
        self.map = generate_map(map_size, len(players), n_barracks, n_mountains)
        self._assign_capitals()
        self.round = 0

    def _assign_capitals(self) -> None:
        capitals = [(x, y) for x in range(len(self.map[0]))
                    for y in range(len(self.map))
                    if self.map[y][x].terrain == "capital"]
        random.shuffle(capitals)
        for i in range(len(self.players)):
            x, y = capitals[i]
            owner = self.players[i]
            self.map[y][x].owner = owner
            self._discover_square_and_adjacent(x, y, owner)

    def _are_valid_coordinates(self, x: int, y: int) -> bool:
        return 0 <= x < len(self.map[0]) and 0 <= y < len(self.map)

    def _discover_square_and_adjacent(self, x: int, y: int, player: Player) -> None:
        for x_shift in range(-1, 2):
            for y_shift in range(-1, 2):
                if self._are_valid_coordinates(x+x_shift, y+y_shift):
                    self.map[y+y_shift][x+x_shift].discoveredBy.append(player)

    def _get_visible_squares(self, player: Player) -> List[List[Dict]]:
        """
        Return the map for the given player exactly like he sees it.
        """
        player_map = [[{} for _ in range(len(self.map[0]))]
                      for _ in range(len(self.map))]
        for y in range(len(player_map)):
            for x in range(len(player_map[0])):
                tile = self.map[y][x]
                if player in tile.discoveredBy or not player.alive:
                    player_map[y][x] = {
                        "terrain": tile.terrain,
                        "color": tile.owner.color if tile.owner else "white",
                        "army": tile.army
                    }
                elif tile.terrain in ["mountain", "barracks", "capital"]:
                    player_map[y][x] = {
                        "terrain": "obstacle",
                        "color": "gray"
                    }
                # else tile remains an empty dict
        return player_map

    def _get_scoreboard(self) -> List[Dict]:
        """
        Return scoreboard, sorted by the army of players (winner first).
        """
        scoreboard = [{
            "username": player.get_username(),
            "army": player.total_army,
            "land": player.total_land,
            "alive": player.alive,
            "color": player.color
        } for player in self.players]
        scoreboard.sort(key=lambda player: player["army"], reverse=True)
        return scoreboard

    def tick(self) -> Dict:
        """
        Real-time tick method, called periodically.
        Performs one move for each player and updates the map accordingly.
        Returns the map for each player as they see it,
        along with the updated scoreboard.
        """
        # TODO make moves
        return {
            "maps": {
                player.get_username(): self._get_visible_squares(player)
                for player in self.players
            },
            "scoreboard": self._get_scoreboard()
        }

