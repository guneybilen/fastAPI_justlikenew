import { useLocation, useNavigate } from 'react-router-dom';
import check_logged_in_status from '../api/check_logged_in_status';

function RequireAuth({ children }) {
  let location = useLocation();
  const navigate = useNavigate();
  check_logged_in_status().then((result) => {
    console.log(result);
    if (result === undefined) {
      navigate('/login', { state: { from: location.pathname } });
    }
  });
  return children;
}

export default RequireAuth;
