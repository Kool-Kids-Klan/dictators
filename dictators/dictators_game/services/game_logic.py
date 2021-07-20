from typing import List, Dict, Tuple
import random

from dictators.dictators_game.services.map_generator import generate_map, draw_map
from dictators.dictators_game.services.lobby_service import Player

# TODO: cleanup, beautify, niekde (x, y) pomenit na Tile?
# TODO: surrender

GAMES = {}


class Game:
    def __init__(self,
                 players: List[Player],
                 width: int,
                 height: int,
                 n_barracks: int,
                 n_mountains: int):
        self.players = players
        self.width = width
        self.height = height
        self.map = generate_map(width, height, len(players), n_barracks, n_mountains)
        self._assign_capitals()
        self.round_n = 1
        self.tick_n = 0
        self.winner = None

    def _get_player_by_username(self, username: str) -> Player:
        """
        :param username: username of the requested player
        :return: Player instance with given username
        """
        player = [player for player in self.players
                  if player.get_username() == username]
        if player:
            return player[0]
        raise ValueError(f"Player with username {username} does not exist.")

    def _get_players_alive(self) -> List[Player]:
        """
        :return: the number of remaining players alive
        """
        return [player for player in self.players if player.alive]

    def _check_for_winner(self) -> None:
        players_alive = self._get_players_alive()
        if len(players_alive) == 1:
            self.winner = players_alive[0]
            self.winner.premoves.clear()

    def _assign_capitals(self) -> None:
        """
        Randomly assign capitals on the generated map to the players.
        To be called before the game actually starts (before first tick).
        :return: nothing
        """
        capitals = [(x, y) for x in range(self.width)
                    for y in range(self.height)
                    if self.map[y][x].terrain == "capital"]
        random.shuffle(capitals)
        for i in range(len(self.players)):
            x, y = capitals[i]
            owner = self.players[i]
            self.map[y][x].owner = owner
            self._discover_tile_and_adjacent((x, y), owner)

    def _are_valid_coordinates(self, x: int, y: int) -> bool:
        """
        :return: True if given coordinates are valid, else False
        """
        return 0 <= x < self.width and 0 <= y < self.height

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
        print("_tile_neighbors_with_player")
        x, y = tile
        for x_shift in range(-1, 2):
            for y_shift in range(-1, 2):
                if (self._are_valid_coordinates(x+x_shift, y+y_shift) and
                        self.map[y + y_shift][x + x_shift].owner == player):
                    return True
        return False

    def _discover_tile_and_adjacent(self,
                                    tile: Tuple[int, int],
                                    player: Player) -> None:
        """
        Mark the given tile and its neighbors as discovered by the given player.

        :param tile: tile to be discovered
        :param player: discovering player
        :return: nothing
        """
        print("discover_tile_and_adjacent")
        x, y = tile
        for x_shift in range(-1, 2):
            for y_shift in range(-1, 2):
                if self._are_valid_coordinates(x + x_shift, y + y_shift):
                    self.map[y + y_shift][x + x_shift].discoveredBy.add(player)

    def _remove_tile_visibility(self,
                                tile: Tuple[int, int],
                                player: Player) -> None:
        """
        Remove visibility that the given tile provided for its old owner.

        :param tile: recently captured tile
        :param player: the old owner of the tile
        :return: nothing
        """
        print("_remove_tile_visibility")
        x, y = tile
        self.map[y][x].discoveredBy.remove(player)
        for x_shift in range(-1, 2):
            for y_shift in range(-1, 2):
                adj_tile = (x + x_shift, y + y_shift)
                if (adj_tile != tile and
                        self._are_valid_coordinates(*adj_tile) and
                        not self._tile_neighbors_with_player(adj_tile, player)):
                    self.map[y + y_shift][x + x_shift].discoveredBy.remove(player)
        if self._tile_neighbors_with_player((x, y), player):
            self.map[y][x].discoveredBy.add(player)

    def _get_visible_tiles(self, player: Player) -> List[List[Dict]]:
        """
        :return: the map for the given player exactly like he sees it.
        """
        player_map = [[{} for _ in range(self.width)]
                      for _ in range(self.height)]
        for y in range(self.height):
            for x in range(self.width):
                tile = self.map[y][x]
                if player in tile.discoveredBy or not player.alive:
                    player_map[y][x] = {
                        "terrain": tile.terrain,
                        "color": tile.owner.color if tile.owner else "white",
                        "army": tile.army
                    }
                    if tile.army == 0:
                        player_map[y][x].pop("army")
                elif tile.terrain in ["mountain", "barracks"]:
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

    def _update_army(self, tile: Tuple[int, int], change: int) -> None:
        """
        Change the amount of army on the given tile.
        Assumes that the updated amount will not be negative.

        :param tile: considered tile
        :param change: amount of army to add/subtract
        :return: nothing
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
        :param army: amount of army that the attacker enters the tile with
        """
        print(f"_capture_tile {tile} enter")
        x, y = tile
        captured_tile = self.map[y][x]
        old_owner = captured_tile.owner

        captured_tile.owner = player
        player.total_army -= captured_tile.army
        player.total_land += 1
        self._discover_tile_and_adjacent(tile, player)
        if old_owner:
            old_owner.total_land -= 1
            old_owner.total_army -= captured_tile.army
            self._remove_tile_visibility(tile, old_owner)
        captured_tile.army = army - captured_tile.army

        if captured_tile.terrain == "capital":
            print("capturing capital")
            old_owner.alive = False
            old_owner.total_army = 0
            old_owner.total_land = 0
            old_owner.premoves.clear()
            captured_tile.terrain = "barracks"
            for row in self.map:
                for current_tile in row:
                    if current_tile.owner == old_owner:
                        current_tile.owner = player
                        player.total_army += current_tile.army
                        player.total_land += 1
                    if old_owner in current_tile.discoveredBy:
                        current_tile.discoveredBy.remove(old_owner)
                        current_tile.discoveredBy.add(player)
            self._check_for_winner()
        print(f"_capture_tile {tile} leave")

    def _combat(self, attacker: Tuple[int, int], defender: Tuple[int, int]) -> None:
        """
        Attack adjacent tile.

        :param attacker: (x,y) coordinates of the tile to attack from
        :param defender: (x,y) coordinates of the tile to attack
        :return: nothing
        """
        print(f"_combat {attacker} -> {defender} enter")
        a_x, a_y = attacker
        d_x, d_y = defender
        attacker_army = self.map[a_y][a_x].army - 1
        defender_army = self.map[d_y][d_x].army
        print(attacker_army, "vs", defender_army)
        attacking_player = self.map[a_y][a_x].owner
        if attacker_army < defender_army:
            # defender wins
            print("defender wins")
            self._update_army(defender, -attacker_army)
            self._update_army(attacker, -attacker_army)
        elif attacker_army > defender_army:
            # attacker wins
            print("attacker wins")
            self.map[a_y][a_x].army = 1
            self._capture_tile(defender, attacking_player, attacker_army)
        else:
            # tie
            print("tie")
            self._update_army(defender, -defender_army)
            self._update_army(attacker, -attacker_army)
        print(f"_combat {attacker} -> {defender} leave")

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
        print("submit_move enter")
        player = self._get_player_by_username(username)
        if not player.alive:
            return
        if len(action) != 1 or action not in "WASDEQ":
            raise Exception("Invalid move. Must be one of: W|A|S|D|E|Q")
        if action in "WASD":
            # W=up  A=left  S=down  D=right
            player.premoves.append((from_tile, action))
        elif action == "E" and player.premoves:
            # cancel last premove
            player.premoves.pop()
        elif action == "Q":
            # cancel all premoves
            player.premoves.clear()
        print("submit move leave")

    def _make_move(self, player: Player) -> None:
        """
        Perform one (previously submitted) move for given player.

        :param player: player to move
        :return: nothing
        """
        print("_make_move enter")
        if not player.premoves:
            return
        move = player.premoves.popleft()
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
        if (current_tile.owner != player or
                current_tile.army == 0 or
                adj_tile.terrain == "mountain"):
            player.premoves.clear()
            return
        if adj_tile.owner == player:
            # moving inside own territory
            adj_tile.army += current_tile.army - 1
            current_tile.army = 1
        else:
            self._combat((x, y), (x + x_shift, y + y_shift))
        print("_make_move leave")

    def _recruit(self, barracks_only: bool) -> None:
        """
        Recruit +1 army on each tile owned by some player.
        :param barracks_only: if False, also recruit +1 on owned plain tiles
        :return: nothing
        """
        print("_recruit enter")
        for x in range(self.width):
            for y in range(self.height):
                tile = self.map[y][x]
                if tile.owner:
                    if tile.terrain in ["barracks", "capital"] or not barracks_only:
                        self._update_army((x, y), +1)
        print("_recruit leave")

    def surrender(self, username: str) -> None:
        """
        Surrender the game for the given player and make all their tiles neutral.
        """
        print("surrendering")
        player = self._get_player_by_username(username)
        player.alive = False
        player.premoves.clear()
        player.total_army = 0
        player.total_land = 0
        for row in self.map:
            for tile in row:
                if tile.owner == player:
                    tile.owner = None
        self._check_for_winner()

    def tick(self) -> Dict:
        """
        Real-time tick method, called periodically.
        Performs one move for each player and updates the map accordingly.
        :return: the map for each player as they see it,
                 along with the updated scoreboard
        """
        if self.winner:
            raise ValueError("Game already ended.")
        for player in self._get_players_alive():
            self._make_move(player)
        if self.tick_n % 2 == 0 and self.tick_n != 0:
            self.round_n += 1
            self._recruit(barracks_only=True)
            if self.round_n % 25 == 0:
                self._recruit(barracks_only=False)
        self.tick_n += 1
        return {
            "maps": {
                player.get_username(): self._get_visible_tiles(player)
                for player in self.players
            },
            "premoves": {
                player.get_username(): list(player.premoves)
                for player in self.players
            },
            "scoreboard": self._get_scoreboard(),
            "winner": self.winner.get_username() if self.winner else None
        }
