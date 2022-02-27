import { AppBar, Toolbar, IconButton, Typography, Button } from '@mui/material';
import { Box } from '@mui/system';
import { Link } from 'react-router-dom';
import './header.scoped.scss';

export default function Header() {
  return (
    <Box sx={{ flexGrow: 0 }} className="header">
      <AppBar position="static">
        <Toolbar>
          <Link to="/">
            <Box
              component="div"
              sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
            >
              <img
                src="/image/logo/picsur.svg"
                alt="Picsur"
                className="svg-logo"
              />
            </Box>
          </Link>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" className="text-link">
              Picsur
            </Link>
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
