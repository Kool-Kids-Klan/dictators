import { atom } from 'recoil';
import {
  IApp, IGame, ILobby, IPremove, IScore,
} from '../resources/types/types';
import { makeId } from '../utils/utils';

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

const webSocketUrl = 'localhost:8000';
const connectionString = `ws://${webSocketUrl}/ws/play/`;

export const gameSocketUrlState = atom<string>({
  key: 'gameSocketUrlState',
  default: `${connectionString}${makeId(5)}/`,
});

export const connectEventState = atom<string>({
  key: 'connectEvent',
  default: '',
});
