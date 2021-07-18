import { selector } from 'recoil';

const roomCode = 1;
const webSocketUrl = 'localhost:8000';
const connectionString = `ws://${webSocketUrl}/ws/play/${roomCode}/`;

let socket: WebSocket | undefined;

export const currentGameSocket = selector({
  key: 'gameSocket',
  get: () => {
    if (!socket) {
      socket = new WebSocket(connectionString);
    }
    return socket;
  },
  set: () => {
    socket = undefined;
  },
});

export default currentGameSocket;
