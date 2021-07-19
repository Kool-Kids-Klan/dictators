from typing import List, Dict, Tuple
import random

from dictators.dictators_game.services.map_generator import generate_map
from dictators.dictators_game.services.lobby_service import Player


# TODO: mapa n*m
# TODO: cleanup, beautify, niekde (x, y) pomenit na Tile?


class Game:
    def __init__(self,
                 players: List[Player],
                 map_size: int,
                 n_barracks: int,
                 n_mountains: int):
        self.players = players
        self.map = generate_map(map_size, len(players), n_barracks, n_mountains)
        self._assign_capitals()
        self.round_n = 1
        self.tick_n = 0

    def _get_player_by_username(self, username: str):
        player = [player for player in self.players
                  if player.get_username() == username]
        if player:
            return player[0]
        raise ValueError(f"Player with username {username} does not exist.")

    def _get_players_alive(self):
        """
        :return: the number of remaining players alive
        """
        return [player for player in self.players if player.alive]

    def _assign_capitals(self) -> None:
        capitals = [(x, y) for x in range(len(self.map[0]))
                    for y in range(len(self.map))
                    if self.map[y][x].terrain == "capital"]
        random.shuffle(capitals)
        for i in range(len(self.players)):
            x, y = capitals[i]
            owner = self.players[i]
            self.map[y][x].owner = owner
            self._discover_tile_and_adjacent((x, y), owner)

    def _are_valid_coordinates(self, x: int, y: int) -> bool:
        return 0 <= x < len(self.map[0]) and 0 <= y < len(self.map)

    def _tile_neighbors_with_player(self,
                                    tile: Tuple[int, int],
                                    player: Player) -> bool:
        """
        Check if some of adjacent tiles of the given tile,
        or the file itself, are owned by the given player.

        :param tile: considered tile
        :param player: considered player
        :return: True if `tile` neighbors with `player`, else otherwise
        """
        x, y = tile
        for x_shift in range(-1, 2):
            for y_shift in range(-1, 2):
                if self.map[y+y_shift][x+x_shift].owner == player:
                    return True
        return False

    def _discover_tile_and_adjacent(self,
                                    tile: Tuple[int, int],
                                    player: Player) -> None:
        x, y = tile
        for x_shift in range(-1, 2):
            for y_shift in range(-1, 2):
                if self._are_valid_coordinates(x+x_shift, y+y_shift):
                    self.map[y+y_shift][x+x_shift].discoveredBy.add(player)

    def _remove_tile_visibility(self,
                                tile: Tuple[int, int],
                                player: Player) -> None:
        x, y = tile
        self.map[y][x].discoveredBy.remove(player)
        for x_shift in range(-1, 2):
            for y_shift in range(-1, 2):
                adj_tile = (x+x_shift, y+y_shift)
                if (self._are_valid_coordinates(*adj_tile) and
                        not self._tile_neighbors_with_player(adj_tile, player)):
                    self.map[y+y_shift][x+x_shift].discoveredBy.remove(player)

    def _get_visible_tiles(self, player: Player) -> List[List[Dict]]:
        """
        :return: the map for the given player exactly like he sees it.
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
        :return: scoreboard, sorted by the army of players (winner first).
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

    def _update_army(self, tile: Tuple[int, int], change: int):
        """
        Change the amount of army on the given tile.
        Assumes that the updated amount will not be negative.

        :param tile: considered tile
        :param change: amount of army to add/subtract
        """
        x, y = tile
        self.map[y][x].army += change
        if self.map[y][x].owner:
            self.map[y][x].owner.total_army += change

    def _capture_tile(self,
                      tile: Tuple[int, int],
                      player: Player,
                      army: int) -> None:
        """
        Change ownership of the given tile.
        If the tile is capital, kill the defeated player, and the new
        owner also gains ownership of all other tiles of the defeated player.

        :param tile: considered tile
        :param player: new owner
        :param army: amount of army of the new owner on the tile
        """
        captured_tile = self.map[tile[0]][tile[1]]
        old_owner = captured_tile.owner

        player.total_land += 1
        captured_tile.owner.total_land -= 1
        captured_tile.army = army
        captured_tile.owner = player
        self._discover_tile_and_adjacent(tile, player)
        if old_owner:
            self._remove_tile_visibility(tile, old_owner)

        if captured_tile.terrain == "capital":
            old_owner.alive = False
            old_owner.total_army = 0
            old_owner.total_land = 0
            for x in range(len(self.map[0])):
                for y in range(len(self.map)):
                    current_tile = self.map[y][x]
                    if current_tile.owner == old_owner:
                        current_tile.owner = player
                        current_tile.terrain = "barracks"
                        player.total_army += current_tile.army
                        player.total_land += 1

    def _combat(self, attacker: Tuple[int, int], defender: Tuple[int, int]) -> None:
        """
        Attack adjacent tile.

        :param attacker: (x,y) coordinates of the tile to attack from
        :param defender: (x,y) coordinates of the tile to attack
        """
        a_x, a_y = attacker
        d_x, d_y = defender
        attacker_army = self.map[a_y][a_x].army - 1
        defender_army = self.map[d_y][d_x].army
        attacking_player = self.map[a_y][a_x].owner
        if attacker_army < defender_army:
            # defender wins
            self._update_army(defender, -attacker_army)
            self._update_army(attacker, -attacker_army)
        elif attacker_army > defender_army:
            # attacker wins
            self._update_army(attacker, -defender_army)
            self._capture_tile(defender, attacking_player,
                               attacker_army-defender_army)
        else:
            # tie
            self._update_army(defender, -defender_army)
            self._update_army(attacker, -attacker_army)

    def submit_move(self,
                    username: str,
                    from_tile: Tuple[int, int],
                    action: str) -> None:
        """
        Add a premove, delete last premove or delete all premoves.

        :param username: username of player to move
        :param from_tile: (x,y) coordinates of the tile to move from
        :param action: action to perform, one of: "W|A|S|D|E|Q"
        :return: nothing
        """
        player = self._get_player_by_username(username)
        if not player.alive:
            return
        if len(action) != 1 or action not in "WASDEQ":
            raise Exception("Invalid move. Must be one of: W|A|S|D|E|Q")
        if action in "WASD":
            # W=up  A=left  S=down  D=right
            player.premoves.append((from_tile, action))
        elif action == "E":
            # cancel last premove
            player.premoves.pop()
        elif action == "Q":
            # cancel all premoves
            player.premoves = []

    def _make_move(self, player: Player) -> None:
        """
        Perform one (previously submitted) move for given player.

        :param player: player to move
        :return: nothing
        """
        move = player.premoves.pop()
        (x, y), direction = move
        current_tile = self.map[y][x]
        if direction == "W":  # UP
            x_shift = 0
            y_shift = -1
        elif direction == "S":  # DOWN
            x_shift = 0
            y_shift = 1
        elif direction == "A":  # LEFT
            x_shift = -1
            y_shift = 0
        else:  # RIGHT
            x_shift = 1
            y_shift = 0
        if not self._are_valid_coordinates(x + x_shift, y + y_shift):
            return
        adj_tile = self.map[y + y_shift][x + x_shift]
        if adj_tile.owner == player:
            # moving inside own territory
            adj_tile.army += current_tile.army - 1
            current_tile.army = 1
        else:
            self._combat((x, y), adj_tile)

    def _recruit(self, barracks_only: bool) -> None:
        """
        Recruit +1 army on each tile owned by some player.
        :param barracks_only: if False, also recruit +1 on owned plain tiles
        :return: nothing
        """
        for x in range(len(self.map[0])):
            for y in range(len(self.map)):
                tile = self.map[y][x]
                if tile.owner:
                    if tile.terrain in ["barracks", "capital"] or not barracks_only:
                        self._update_army((x, y), +1)

    def tick(self) -> Dict:
        """
        Real-time tick method, called periodically.
        Performs one move for each player and updates the map accordingly.
        :return: the map for each player as they see it,
                 along with the updated scoreboard
        """
        for player in self._get_players_alive():
            self._make_move(player)
        if self.tick_n % 2 == 0 and self.tick != 0:
            self.round_n += 1
            self._recruit(barracks_only=True)
            if self.round_n % 25 == 0:
                self._recruit(barracks_only=False)
        playersAlive = self._get_players_alive()
        gameEnded = len(playersAlive) == 1
        return {
            "maps": {
                player.get_username(): self._get_visible_tiles(player)
                for player in self.players
            },
            "scoreboard": self._get_scoreboard(),
            "winner": playersAlive[0].get_username() if gameEnded else None
        }

