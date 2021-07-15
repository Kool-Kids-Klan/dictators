import { atom } from 'recoil';

interface IApp {
  authenticated: boolean,
}

interface IUser {
  email: string,
  password: String
}

interface IGame {
  selected?: [number, number]
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
