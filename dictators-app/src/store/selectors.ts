import { selector } from 'recoil';
import { makeId } from '../utils/utils';
import { gameSocketUrlState } from './atoms';

const webSocketUrl = 'localhost:8000';
const connectionString = `ws://${webSocketUrl}/ws/play/`;

let socket: WebSocket | undefined;

export const currentGameSocket = selector({
  key: 'gameSocket',
  dangerouslyAllowMutability: true,
  get: ({ get }) => {
    console.log('get game socket called');
    const url = get(gameSocketUrlState);
    // while (!url) {
    //   console.log('url not set');
    // }
    if (!url) {
      alert('url was not defined');
    }
    // if (!socket) {
    //   return new WebSocket(`${connectionString}${makeId(5)}/`);
    // }
    // if (readyState !== socket.readyState) {
    //   return new WebSocket(`${connectionString}${makeId(5)}/`);
    // }
    return new WebSocket(url);
  },
  set: () => {
    socket = undefined;
  },
});

export default currentGameSocket;
