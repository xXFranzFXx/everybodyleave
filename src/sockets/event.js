import { socket } from './index';

export const socketEvents = ({ state }) => {
 
    socket.on('notifications', ({ notifications }) => {
      return { ...state, notifications  };
    });
}