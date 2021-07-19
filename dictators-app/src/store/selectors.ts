import { selector } from 'recoil';
import { gameSocketUrlState } from './atoms';

const webSocketUrl = 'localhost:8000';
const connectionString = `ws://${webSocketUrl}/ws/play/`;

let socket: WebSocket | undefined;

export const currentGameSocket = selector({
  key: 'gameSocket',
  get: ({ get }) => {
    const url = get(gameSocketUrlState);
    if (socket) {
      socket.close(1000);
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
