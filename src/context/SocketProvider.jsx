import { createContext, useEffect, useContext, useRef } from 'react'
import { proxy, useSnapshot } from 'valtio'
import { initSockets } from "../sockets";
import secureLocalStorage from "react-secure-storage"
import { deepMergeObjects } from '../sockets/helpers';
export const SocketContext = createContext()

const SocketProvider = ({ children }) => {
  const state = useRef(proxy({
    scheduledNotifications:[
         {
            user: "",
            email: "",
            date: "",
            time: "",
            methods: "",
        }
      ]
})).current


  useEffect(() => initSockets({ state }), [initSockets]);

  return (
    <SocketContext.Provider value={state}>
        {children}
    </SocketContext.Provider>
  )
}

export function useSocketContext() {
  const  state  = useContext(SocketContext);
  const snap = useSnapshot(state);
  return { state, snap }
}

export default SocketProvider;
