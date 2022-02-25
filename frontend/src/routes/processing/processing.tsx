import Centered from '../../components/centered/centered';
import CircularProgress from '@mui/material/CircularProgress';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { HasFailed } from 'imagur-shared/dist/types';
import ImagesApi from '../../api/images';

export interface ProcessingViewMetadata {
  imageFile: File;
}

function ProcessingView(props: any) {
  const state: ProcessingViewMetadata = useLocation().state as any;
  const navigate = useNavigate();

  async function onRendered() {
    if (!state) navigate('/');

    const hash = await ImagesApi.I.UploadImage(state.imageFile);
    if (HasFailed(hash)) navigate('/'); // TODO: handle error

    navigate('/view/' + hash, { replace: true });
  }

  // Run when rendered
  useEffect(() => {
    onRendered().catch(console.error);
  });

  return (
    <section className="contentwindow">
      <Centered>
        <h1>Processing</h1>
        <CircularProgress />
      </Centered>
    </section>
  );
}

export default ProcessingView;
