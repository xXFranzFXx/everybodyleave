import { createContext, useEffect, useContext, useRef } from 'react'
import { proxy, useSnapshot } from 'valtio'
import { initSockets } from "../sockets";
export const SocketContext = createContext()

const SocketProvider = ({ children }) => {
  const state = useRef(proxy({
            phone: "",
            short_timezone: new Date().toLocaleDateString(undefined, {day:'2-digit',timeZoneName: 'short' }).substring(4),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            reminder:"",
            acceptTerms: false,
            scheduledEvent: false,

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
