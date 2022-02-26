import { useSnackbar } from 'notistack';
import Dropzone from 'react-dropzone';
import { useNavigate } from 'react-router-dom';

import Centered from '../../components/centered/centered';
import { ProcessingViewMetadata } from '../processing/processing';

export default function UploadView() {
  const navigate = useNavigate();
  const snackbar = useSnackbar();

  function onAcceptedFiles(files: File[]) {
    if (files.length > 1) {
      snackbar.enqueueSnackbar(
        'You uploaded multiple images, only one has been uploaded',
        {
          variant: 'info',
        },
      );
    }

    const metadata: ProcessingViewMetadata = {
      imageFile: files[0],
    };
    navigate('/processing', {
      state: metadata,
    });
  }

  return (
    <>
      <Dropzone onDrop={onAcceptedFiles}>
        {({ getRootProps, getInputProps }) => (
          <section className="contentwindow">
            <Centered {...getRootProps()}>
              <input {...getInputProps()} />

              <h1>Upload Image</h1>
              <p>Drag and drop an image here, or click to select an image</p>
            </Centered>
          </section>
        )}
      </Dropzone>
    </>
  );
}
