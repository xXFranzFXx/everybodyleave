import logo from './logo.svg';
import './App.css';
import { ThemeProvider } from '@mui/material/node/styles';
import { CssBaseline } from '@mui/material/node';
import { createTheme } from '@mui/material/node/styles'; 
import MainForm from './form/MainForm';
import SimpleForm from './form/SimpleForm';
import LoginButton from './components/LoginButton';
import { useAuth0 } from '@auth0/auth0-react';
import OTPInput from './form-components/FormOtpInputs';

function App() {
  const { isAuthenticated } = useAuth0();
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
          {isAuthenticated  ?
              <SimpleForm/>
         :
              <LoginButton/>
            }
    </ThemeProvider>
  );
}

export default App;
