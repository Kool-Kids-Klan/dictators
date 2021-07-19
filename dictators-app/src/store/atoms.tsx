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
    game: [
      [{ army: 1, color: 'blue', terrain: 'barracks' }, { army: 120, color: 'blue' },
        {}, { army: 10, color: 'red' }],
      [{ army: 1, color: 'blue' }, { army: 120, color: 'blue', terrain: 'capital' },
        { army: 1, color: 'red', terrain: 'mountains' }, { army: 10, color: 'red' }],
      [{ army: 1, color: 'blue' }, {}, { army: 1, color: 'red' },
        { army: 10, color: 'green' }],
      [{ terrain: 'capital' }, { army: 120, color: 'blue' },
        { army: 1, color: 'red', terrain: 'barracks' }, { army: 10, color: 'red' }],
    ],
  },
});

export const premovesState = atom<IPremove[]>({
  key: 'premoves',
  default: [],
});

export const scoreState = atom<IScore[]>({
  key: 'scores',
  default: [{
    username: 'Paly', land: 69, army: 420, color: 'blue',
  }, {
    username: 'Duri', land: 96, army: 50, color: 'red',
  }, {
    username: 'Dano', land: 9, army: 40, color: 'green',
  }, {
    username: 'Filo', land: 79, army: 42, color: 'purple',
  }],
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
