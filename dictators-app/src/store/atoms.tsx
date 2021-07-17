import { atom } from 'recoil';

interface IApp {
  authenticated: boolean,
  username?: string,
}

export type Coor = [number, number];

interface IPremove {
  from: Coor,
  to: Coor,
  direction: string
}

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
