import { selector } from 'recoil';
import { gameSocketUrlState } from './atoms';

const webSocketUrl = `${window.location.hostname}:8000`;
export const connectionString = `ws://${webSocketUrl}/ws/play/`;

let socket: WebSocket | undefined;

export const currentGameSocket = selector({
  key: 'gameSocket',
  get: ({ get }) => {
    const url = get(gameSocketUrlState);
    if (socket) {
      socket.close(1000);
    }
    socket = new WebSocket((url === '') ? `${connectionString}room/` : url);
    return socket;
  },
  set: () => {
    socket = undefined;
  },
});

export default currentGameSocket;
