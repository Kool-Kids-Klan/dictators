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
  to: Coor
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
