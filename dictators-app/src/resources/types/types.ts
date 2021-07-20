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
  id: string
  players: IPlayer[]
}

export interface IGameTile {
  army?: number
  color?: string
  terrain?: string
}

export interface IGame {
  isOver?: boolean
  winner?: string
  game: IGameTile[][]
}

export type Coor = [number, number];

export interface IPremove {
  from: Coor,
  direction: string
}

export interface IScore {
  username: string, land: number, army: number, color: string
}

export interface IScoreProps {
  scores: IScore[]
}

export interface ITile {
  army?: number,
  owner?: string,
  terrain?: string,
  selected?: string,
  select: () => void,
  directions: Set<string>,
}

export interface ILobbyPlayerProps {
  name: string,
  color: string,
  ready: boolean
}
