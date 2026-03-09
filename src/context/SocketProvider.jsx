import { createContext, useEffect, useContext, useRef } from 'react'
import { useAuth0 } from '@auth0/auth0-react';

import { proxy, useSnapshot } from 'valtio'
import { initSockets } from "../sockets";
export const SocketContext = createContext()

const SocketProvider = ({ children }) => {
  const { user } = useAuth0();
  const state = useRef(proxy({
            phone: "",
            short_timezone: new Date().toLocaleDateString(undefined, {day:'2-digit',timeZoneName: 'short' }).substring(4),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            currentReminder: "",
            reminders:[],
            intention:"",
            intention2: "", 
            acceptTerms: false,
            scheduledEvent: false,
            dialogOpen:false,
            drawerOpen: false,
            hasCancelled: "",
            updatedReminders: [],
            hasSavedCalendar: false, 
            hasDeletedCalendar: false,
            saveSuccess: false


})).current

 useEffect(() => {
    const name = user?.name;
    state.phone = name;
  }, [user]);
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
