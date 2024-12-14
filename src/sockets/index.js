import io from "socket.io-client";
import { socketEvents } from "./event";
import { getNotifications } from "./emit";

const url = "http://localhost:4000/"

export const socket = io(url, { transports : ['polling', 'websocket', 'flashsocket'] });
export const initSockets = ({ state }) => {
  socketEvents({ state }); 
  getNotifications(); //will run on initial connect
};
