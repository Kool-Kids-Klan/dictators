import random
from typing import List, Set, Tuple, NewType


# TODO
# size -> width+height
# nahradit fixne pocty barracks/mountains multipliermi (ako v Generals) a vysledny pocet zaokruhlovat na najblizsi nasobok 4ky
# forest tile? nema vision na susedne tiles, nevidiet co je v nom ak ho nekontrolujem (OP?)


PLAIN_STARTING_ARMY = 0
BARRACKS_STARTING_ARMY = 50
CAPITAL_STARTING_ARMY = 1


class Tile:
    def __init__(self, terrain, army):
        self.terrain = terrain
        self.army = army
        self.owner = None
        self.discoveredBy = set()


MAP_T = NewType("MAP_T", List[List[Tile]])


def _dist(tile1, tile2):
    """
    :param tile1:
    :param tile2:
    :return: Manhattan distance of the given tiles
    """
    return abs(tile1[0]-tile2[0]) + abs(tile1[1]-tile2[1])


def _check_capitals_distance(capitals: List[Tuple[int, int]],
                             size: int) -> bool:
    """
    Check if capitals are far enough from each other (half of the size) by air distance.
    :param capitals: positions of the capitals
    :param size: length of the edge of the map
    :return: True if capitals are positioned appropriately, False otherwise
    """
    for i in range(len(capitals)):
        for j in range(i+1, len(capitals)):
            if _dist(capitals[i], capitals[j]) < size/2:
                return False
    return True


def _DFS(M: MAP_T,
         mountains: list,
         position: (int, int),
         visited: Set[Tuple[int, int]]) -> Set[Tuple[int, int]]:
    """
    Perform DFS from the given tile and return all discovered capitals.
    :param M: map without mountain tiles
    :param mountains: list of mountain tiles
    :param position: current coordinates - (x, y)
    :param visited: list of already visited tiles during DFS
    :return: positions of all discovered capitals during DFS
    """

    x, y = position
    if x < 0 or y < 0 or x >= len(M[0]) or y >= len(M) or position in mountains:
        return set()
    visited.add(position)
    capitals = set()
    if M[y][x].terrain == "capital":
        capitals.add(position)
    neighbors = [(x-1, y), (x+1, y), (x, y-1), (x, y+1)]
    for neighbor in neighbors:
        if neighbor not in visited:
            capitals |= _DFS(M, mountains, neighbor, visited)
    return capitals


def _check_capitals_accessibility(M: MAP_T,
                                  mountains: List[Tuple[int, int]]) -> bool:
    """
    Check if there exists a path from every capital on the map to each other,
    with respect to the provided mountain tiles.
    :param M: map with capitals and without mountain tiles
    :param mountains: list of mountain tiles
    :return: True if all the capitals are "connected", False otherwise
    """
    capitals = [(x, y) for y in range(len(M)) for x in range(len(M[0]))
                if M[y][x].terrain == "capital"]
    connected_capitals = _DFS(M, mountains, capitals[0], set())
    return connected_capitals == set(capitals)


def generate_map(size: int,
                 n_players: int,
                 n_barracks: int,
                 n_mountains: int) -> MAP_T:
    """
    Generate random map with respect to the provided parameters.
    :param size: length of the edge of the map
    :param n_players: number of players in the game
    :param n_barracks: number of barracks on the map
    :param n_mountains: number of mountain tiles on the map
    :return: generated map
    """

    # Verify parameters
    if n_players < 2 or n_players > 4:
        raise ValueError("Only 2-4 players are allowed.")
    if size % 2 != 0:
        raise ValueError("Map size must be even.")
    if n_barracks == 0 or n_barracks % 4 != 0:
        raise ValueError("Number of barracks must be non-zero and divisible by 4.")
    if n_mountains % 4 != 0:
        raise ValueError("Number of mountains must be divisible by 4.")

    M = MAP_T([[Tile(terrain="plain", army=PLAIN_STARTING_ARMY)
                for _ in range(size)] for _ in range(size)])
    quadrants = [[] for _ in range(4)]  # [TL, TR, BL, BR]
    for y in range(size):
        for x in range(size):
            if y < size/2:
                if x < size/2:
                    quadrants[0].append((x, y))
                else:
                    quadrants[1].append((x, y))
            else:
                if x < size/2:
                    quadrants[2].append((x, y))
                else:
                    quadrants[3].append((x, y))

    barracks = [[] for _ in range(len(quadrants))]
    while True:
        # Generate barracks
        for i in range(len(quadrants)):
            q = quadrants[i]
            barracks[i] = random.sample(q, n_barracks // 4)

        # Promote random barracks to capital for each player
        populated_quadrants = random.sample(range(4), n_players)
        capitals = []
        for i in range(len(quadrants)):
            if i in populated_quadrants:
                capitals.append(random.choice(barracks[i]))
        if _check_capitals_distance(capitals, size):
            for i in range(len(quadrants)):
                quadrants[i] = list(set(quadrants[i]) - set(barracks[i]))
                for (x, y) in barracks[i]:
                    if (x, y) in capitals:
                        M[y][x].terrain = "capital"
                        M[y][x].army = CAPITAL_STARTING_ARMY
                    else:
                        M[y][x].terrain = "barracks"
                        M[y][x].army = BARRACKS_STARTING_ARMY
            break

    # Generate mountains
    while True:
        mountains = []
        for q in quadrants:
            mountains += random.sample(q, n_mountains // 4)
        if _check_capitals_accessibility(M, mountains):
            for (x, y) in mountains:
                M[y][x].terrain = "mountain"
                M[y][x].army = 0
            break
    return M


def draw_map(M: MAP_T) -> None:
    """
    Draw map into the console for debugging purposes.
    :param M: map
    :return: nothing
    """
    print("===========================")
    for row in M:
        for tile in row:
            if tile.terrain == "mountain":
                letter = "X"
            elif tile.terrain == "barracks":
                letter = "B"
            elif tile.terrain == "capital":
                letter = "C"
            else:
                letter = "."
            print(letter, end="")
        print()
    print("===========================")


# sample_map = generate_map(16, 4, 8, 100)
# draw_map(sample_map)

