import { atom } from 'recoil';
import {
  IApp, IGame, ILobby, IPremove,
} from '../resources/types/types';

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
