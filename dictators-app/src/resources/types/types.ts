export interface IApp {
  authenticated: boolean,
  username?: string,
}

export interface IPlayer {
  name: string
  color: string
  ready: boolean
}

export interface ILobby {
  players: IPlayer[]
}

export interface IGameTile {
  army: number
  owner: string
  terrain: string
}

export interface IGame {
  game: IGameTile[][]
}

export type Coor = [number, number];

export interface IPremove {
  from: Coor,
  to: Coor,
  direction: string
}

export interface IScoreProps {
  scores: { player: string, land: string, army: string, color: string }[]
}

export interface ISquare {
  army?: number,
  owner?: string,
  terrain?: string,
  selected?: string,
  select: () => void,
  directions?: string,
}

export interface ILobbyPlayerProps {
  name: string,
  color: string,
  ready: boolean
}
