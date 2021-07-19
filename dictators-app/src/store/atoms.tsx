import { atom } from 'recoil';
import {
  IApp, IGame, ILobby, IPremove, IScore,
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
    id: 'Loading...',
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

export const scoreState = atom<IScore[]>({
  key: 'scores',
  default: [],
});

export const gameSocketUrlState = atom<string>({
  key: 'gameSocketUrlState',
  default: '',
});

export const connectEventState = atom<string>({
  key: 'connectEvent',
  default: '',
});
