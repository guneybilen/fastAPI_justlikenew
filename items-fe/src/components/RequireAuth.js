import { useLocation, useNavigate } from 'react-router-dom';
import check_logged_in_status from '../api/check_logged_in_status';
import { useState } from 'react';

function RequireAuth({ children }) {
  let location = useLocation();
  const [datastate, setDatastate] = useState(null);
  const navigate = useNavigate();
  check_logged_in_status().then((result) => {
    console.log(result);
    setDatastate(result);
    if (result !== 'LOGGED' || result === undefined) {
      navigate('/login', { state: { from: location.pathname } });
    }
  });
  return datastate && children;
}

export default RequireAuth;
