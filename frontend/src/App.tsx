import { useState } from 'react';
import UploadScreen from './upload/upload';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Centered from './components/centered/centered';
import Processing from './processing/processing';
import Finished from './finished/finished';

enum States {
  Selecting,
  Uploading,
  Finished,
}

function App() {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const baseURL = location.protocol + '//' + location.host;

  let [state, setState] = useState(States.Selecting);
  let [imageURL, setImageURL] = useState('');

  async function onImage(image: File) {
    console.log(image);
    setState(States.Uploading);

    // Upload image to /i with multipart
    // When done, setState(States.Finished)

    // Create multipart body
    const formData = new FormData();
    formData.append('image', image);

    // Upload image
    const result = await fetch('/i', {
      method: 'POST',
      body: formData,
    }).then((res) => res.json());

    console.log(`${baseURL}/i/${result.hash}`);

    setImageURL(`${baseURL}/i/${result.hash}`);
    setState(States.Finished);
  }

  function getView() {
    switch (state) {
      case States.Selecting:
        return <UploadScreen onImage={onImage} />;
      case States.Uploading:
        return <Processing />;
      case States.Finished:
        return <Finished imageURL={imageURL} />;
      default:
        return <div>Unknown state</div>;
    }
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Centered screen={true}>{getView()}</Centered>
    </ThemeProvider>
  );
}

export default App;
