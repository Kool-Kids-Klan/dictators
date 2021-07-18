import { atom } from 'recoil';

interface IApp {
  authenticated: boolean,
  username?: string,
}

export interface IPlayer {
  name: string
  color: string
}

interface ILobby {
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

interface IPremove {
  from: Coor,
  to: Coor,
  direction: string
}

export const appState = atom<IApp>({
  key: 'auth',
  default: {
    authenticated: false,
  },
});

export const lobbyState = atom<ILobby>({
  key: 'lobby',
  default: {
    players: [],
  },
});

export const gameState = atom<IGame>({
  key: 'game',
  default: {
    game: [],
  },
});

export const premovesState = atom<IPremove[]>({
  key: 'premoves',
  default: [],
});
