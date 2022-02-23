import Centered from '../components/centered/centered';
import CircularProgress from '@mui/material/CircularProgress';

function Finished(props: { imageURL: string }) {
  return (
    <Centered>
      <h1>Finished</h1>
      <img src={props.imageURL}></img>
    </Centered>
  );
}

export default Finished;
