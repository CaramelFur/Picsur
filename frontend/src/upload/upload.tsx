import React from 'react';
import Dropzone from 'react-dropzone';
import Box from '@mui/material/Box';

import './upload.css';
import Centered from '../components/centered/centered';

function UploadScreen(props: { onImage: (image: File) => void }) {
  function onAcceptedFiles(files: File[]) {
    props.onImage(files[0]);
  }

  return (
    <>
      <Dropzone onDrop={onAcceptedFiles}>
        {({ getRootProps, getInputProps }) => (
          <section className="dropzone">
            <Centered {...getRootProps()}>
              <input {...getInputProps()} />

              <h1>Upload Image</h1>
              <p>Drag 'n' drop some images here, or click to select an image</p>
            </Centered>
          </section>
        )}
      </Dropzone>
    </>
  );
}

export default UploadScreen;
