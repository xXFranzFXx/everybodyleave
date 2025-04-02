import logo from './logo.svg';
import './App.css';
import { ThemeProvider } from '@mui/material/node/styles';
import { CssBaseline } from '@mui/material/node';
import { createTheme } from '@mui/material/node/styles'; 
import MainForm from './form/MainForm';

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
        fullWidth: true,
        InputLabelProps: { shrink: true } // <----
      }
    },
    MuiInputBase: {
     
        // variant: 'outlined',
        // margin: 'dense',
        // size: 'small',
        // fullWidth: true,
        InputLabelProps: { shrink: true } // <----
      
    }
  }
  });
  
  return (
    <ThemeProvider theme={theme}>
            <CssBaseline/>
              <MainForm/>
    </ThemeProvider>
  );
}

export default App;
