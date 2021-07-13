import { atom } from 'recoil';

interface IApp {
  authenticated: boolean,
}

interface IUser {
  email: string,
  password: String
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
