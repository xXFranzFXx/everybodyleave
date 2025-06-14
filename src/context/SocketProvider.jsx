import { createContext, useEffect, useContext, useRef } from 'react'
import { proxy, useSnapshot } from 'valtio'
import { initSockets } from "../sockets";
export const SocketContext = createContext()

const SocketProvider = ({ children }) => {
  const state = useRef(proxy({
            user: "",
            email: "",
            date: new Date(),
            phone: "",
            time: "",
            default_timezone: new  Intl.DateTimeFormat().resolvedOptions().timeZone,
            utcdate:"",
            type: [],
            reminders:[],
            acceptTerms: false,
            otp: ""
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
