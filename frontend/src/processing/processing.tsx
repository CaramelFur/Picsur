import Centered from '../components/centered/centered';
import CircularProgress from '@mui/material/CircularProgress';

function Processing() {
  return (
    <Centered>
      <h1>Processing</h1>
      <CircularProgress />
    </Centered>
  );
}

export default Processing;
