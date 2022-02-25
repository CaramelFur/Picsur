import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Centered from './components/centered/centered';
import './app.scss';
import AppRouter from './routes/router';
import { SnackbarProvider } from 'notistack';

export default function App() {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      <SnackbarProvider maxSnack={3}>
        <Centered fullScreen={true}>
          <AppRouter />
        </Centered>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
