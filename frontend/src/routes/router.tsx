import { Routes, Route } from 'react-router-dom';
import LoginView from './login/login';
import ProcessingView from './processing/processing';
import UploadView from './upload/upload';
import ViewView from './view/view';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<UploadView />} />
      <Route path="login" element={<LoginView />} />
      <Route path="processing" element={<ProcessingView />} />
      <Route path="view/:hash" element={<ViewView />} />
    </Routes>
  );
}
