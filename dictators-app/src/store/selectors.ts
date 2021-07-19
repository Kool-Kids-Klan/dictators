import { selector } from 'recoil';
import { makeId } from '../utils/utils';

const webSocketUrl = 'localhost:8000';
const connectionString = `ws://${webSocketUrl}/ws/play/`;

let socket: WebSocket | undefined;

export const currentGameSocket = selector({
  key: 'gameSocket',
  get: () => {
    if (!socket) {
      socket = new WebSocket(`${connectionString}room/`);
    }
    return socket;
  },
  set: () => {
    socket = undefined;
  },
});

export default currentGameSocket;
