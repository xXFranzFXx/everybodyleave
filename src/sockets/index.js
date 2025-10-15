import io from "socket.io-client";
import { socketEvents } from "./event";

const url = "https://everybodyleave.onrender.com"

export const socket = io(url, { transports : ['polling', 'websocket', 'flashsocket'] });
export const initSockets = ({ state }) => {
  socketEvents({ state }); 
};
