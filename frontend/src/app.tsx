import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Centered from './components/centered/centered';
import './app.scss';
import AppRouter from './routes/router';
import { SnackbarProvider } from 'notistack';
import Header from './components/header/header';
import { Container } from '@mui/material';
import Footer from './components/footer/footer';

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
        <Header />
        <Container className="main-container">
          <AppRouter />
        </Container>
        <Footer />
      </SnackbarProvider>
    </ThemeProvider>
  );
}
