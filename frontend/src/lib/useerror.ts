import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

export default function useError() {
  const notify = useSnackbar();
  const navigate = useNavigate();

  return (error: string) => {
    notify.enqueueSnackbar(error, {
      variant: 'error',
    });
    navigate('/');
  };
}
