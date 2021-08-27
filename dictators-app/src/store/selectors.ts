import { selector } from 'recoil';
import { gameSocketUrlState } from './atoms';
import { BACKEND_URL } from '../utils/endpoints';

const webSocketUrl = `${BACKEND_URL}`;
export const connectionString = `wss://${webSocketUrl}/ws/play/`;

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
