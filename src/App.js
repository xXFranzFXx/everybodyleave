import logo from './logo.svg';
import './App.css';
import { ThemeProvider } from '@mui/material/node/styles';
import { CssBaseline } from '@mui/material/node';
import { createTheme } from '@mui/material/node/styles'; 
import MainForm from './form/MainForm';
import SimpleForm from './form/SimpleForm';
import OTPInput from './form-components/FormOtpInputs';

function App() {
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
            <OTPInput/>

              {/* <MainForm/> */}
              {/* <SimpleForm/> */}
    </ThemeProvider>
  );
}

export default App;
