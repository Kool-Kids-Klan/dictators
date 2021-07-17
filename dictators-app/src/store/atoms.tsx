import { atom } from 'recoil';

interface IApp {
  authenticated: boolean,
  username?: string,
}

interface IUser {
  email: string,
  password: String
}

export type Coor = [number, number];

interface IPremove {
  from: Coor,
  to: Coor,
  direction: string
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

export const premovesState = atom<IPremove[]>({
  key: 'premoves',
  default: [],
});
