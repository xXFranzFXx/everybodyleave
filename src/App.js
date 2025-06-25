import React, { useState, useEffect } from 'react';
import './App.css';
import { ThemeProvider } from '@mui/material/node/styles';
import { CssBaseline } from '@mui/material/node';
import { createTheme } from '@mui/material/node/styles'; 
import MainForm from './form/MainForm';
import SimpleForm from './form/SimpleForm';
import LoginButton from './components/LoginButton';
import { useAuth0 } from '@auth0/auth0-react';
import { useSocketContext } from './context/SocketProvider';

function App() {
  const { isAuthenticated, user } = useAuth0();
  const [userInfo, setUserInfo] = useState('')
  const { state } = useSocketContext();

  useEffect(() => {
    const name = user?.name;
    const reminder = user?.reminder
    if(Array.isArray(reminder)) {
      state.reminder = reminder.map(day => new Date(day))
     }
  
    setUserInfo(name)
    state.phone = name;
    state.reminder = new Date(reminder)
  },[user] );

  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#000000',
      },
      secondary: {
        main: '#FFFFFF',
      },
      info: {
        main: '#000000',
      },
    },
    typography: {
      h6: {
      fontFamily: '',
      lineHeight: 3 
      }
    },
    components: {
    MuiInputLabel: {
      defaultProps: {
        variant: 'outlined',
        margin: 'dense',
        size: 'small',
        // fullWidth: true,
        InputLabelProps: { shrink: true } // <----
      }
    },
    MuiInputBase: {
        InputLabelProps: { shrink: true } // <----
      
    },
    
  },
 
  });
  
  return (
    <ThemeProvider theme={theme}>
            <CssBaseline/>
          { isAuthenticated  ? <SimpleForm userInfo={userInfo}/>
              : <LoginButton/>
            }
    </ThemeProvider>
  );
}

export default App;
