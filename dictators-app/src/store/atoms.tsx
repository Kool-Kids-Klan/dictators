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
    players: [],
  },
});

export const gameState = atom<IGame>({
  key: 'game',
  default: {
    game: [
      [{ army: 1, owner: 'blue', terrain: 'barracks' }, { army: 120, owner: 'blue' },
        {}, { army: 10, owner: 'red' }],
      [{ army: 1, owner: 'blue' }, { army: 120, owner: 'blue', terrain: 'capital' },
        { army: 1, owner: 'red', terrain: 'mountains' }, { army: 10, owner: 'red' }],
      [{ army: 1, owner: 'blue' }, {}, { army: 1, owner: 'red' },
        { army: 10, owner: 'green' }],
      [{ terrain: 'capital' }, { army: 120, owner: 'blue' },
        { army: 1, owner: 'red', terrain: 'barracks' }, { army: 10, owner: 'red' }],
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
    player: 'Paly', land: 69, army: 420, color: 'blue',
  }, {
    player: 'Duri', land: 96, army: 50, color: 'red',
  }, {
    player: 'Dano', land: 9, army: 40, color: 'green',
  }, {
    player: 'Filo', land: 79, army: 42, color: 'purple',
  }],
});
