import React, { useState, useEffect } from 'react';
import './App.css';
import { ThemeProvider } from '@mui/material/node/styles';
import { CssBaseline } from '@mui/material/node';
import { createTheme } from '@mui/material/node/styles';
import SimpleForm from './form/SimpleForm'
import LoginButton from './components/LoginButton';
import { useAuth0 } from '@auth0/auth0-react';
import SocketProvider from './context/SocketProvider';
import MetaDataProvider from './context/MetadataProvider';
import CalendarProvider from './context/CalendarProvider';
import SettingsProvider from './context/SettingsProvider';
import ProtectedRoute from './routes/ProtectedRoute';
import NavBar from './components/NavBar';
import AllRoutes from './routes/AllRoutes';
import MultiUpsellCheckout from './components/paypal/Upsells';
import CalendarViewButton from './components/calendar/CalendarViewButton';
function App() {
  const { isAuthenticated, user, loginWithRedirect } = useAuth0();
  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
    palette: {
      mode: 'light',
      primary: {
        main: '#000000',
        contrastText: '#fff',
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
        lineHeight: 3,
      },
    },
    components: {
      MuiInputLabel: {
        defaultProps: {
          variant: 'outlined',
          margin: 'dense',
          size: 'small',
          // fullWidth: true,
          InputLabelProps: { shrink: true }, // <----
        },
      },
      MuiInputBase: {
        InputLabelProps: { shrink: true }, // <----
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isAuthenticated ? (
        <>
          <SocketProvider>
            <SettingsProvider>
              <MetaDataProvider>
                <CalendarProvider>
                  <NavBar />
                      <CalendarViewButton/>

                  <AllRoutes/>
                </CalendarProvider>
              </MetaDataProvider>
            </SettingsProvider>
          </SocketProvider>
        </>
      ) : (
        <LoginButton />
      )}
    </ThemeProvider>
  );
}

export default App;
