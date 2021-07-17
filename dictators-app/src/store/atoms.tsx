import { atom } from 'recoil';

interface IApp {
  authenticated: boolean,
}

interface IUser {
  email: string,
  password: String
}

export type Coor = [number, number];

interface IGame {
  selected?: Coor
}

interface IPremove {
  from: Coor,
  to: Coor,
  direction: string
}

interface IScore {
  player: string,
  land: number,
  army: number,
  color: string
}

export const usersState = atom<IUser[]>({
  key: 'user',
  default: [
    {
      email: 'a@g',
      password: '123',
    },
    {
      email: 'b@b',
      password: '222',
    },
  ],
});

export const appState = atom<IApp>({
  key: 'auth',
  default: {
    authenticated: false,
  },
});

export const gameState = atom<IGame>({
  key: 'game',
  default: {},
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
