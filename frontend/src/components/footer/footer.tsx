import { Box, Container } from '@mui/material';
import './footer.scoped.scss';

export default function Footer() {
  return (
    <Box sx={{ flexGrow: 0 }} className="footer">
      <Container className="footer-container"></Container>
    </Box>
  );
}
