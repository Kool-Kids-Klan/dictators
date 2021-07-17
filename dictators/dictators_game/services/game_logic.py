from typing import List, Dict

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
        self.round = 0

    def _get_visible_squares(self, player: Player):
        """
        Return the map for the given player exactly like he sees it.
        """
        player_map = [[{} for _ in range(len(self.map[0]))]
                      for _ in range(len(self.map[0]))]
        for y in range(len(player_map)):
            for x in range(len(player_map[0])):
                tile = self.map[y][x]
                if player.get_username() in tile.discoveredBy or not player.alive:
                    player_map[y][x] = {
                        "terrain": tile.terrain,
                        "color": tile.owner.color,
                        "army": tile.army
                    }
                elif tile.terrain in ["barracks", "mountain"]:
                    player_map[y][x] = {
                        "terrain": "obstacle"
                    }
                # else tile is empty dict
        return player_map

    def _get_scoreboard(self) -> List[Dict]:
        """
        Return scoreboard, sorted by the army of players (winner first).
        """
        scoreboard = [{
            "username": player.get_username(),
            "army": player.total_army,
            "land": player.total_land,
            "alive": player.alive
        } for player in self.players]
        scoreboard.sort(key=lambda player: player["army"], reverse=True)
        return scoreboard

    def tick(self):
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

