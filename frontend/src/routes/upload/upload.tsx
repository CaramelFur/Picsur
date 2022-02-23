import Dropzone from 'react-dropzone';
import { useNavigate } from 'react-router-dom';

import Centered from '../../components/centered/centered';
import { ProcessingViewMetadata } from '../processing/processing';

export default function UploadView() {
  const navigate = useNavigate();

  function onAcceptedFiles(files: File[]) {
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
              <p>Drag and drop some images here, or click to select an image</p>
            </Centered>
          </section>
        )}
      </Dropzone>
    </>
  );
}
