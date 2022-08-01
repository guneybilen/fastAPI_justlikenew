import { useLocation, useNavigate } from 'react-router-dom';
import check_logged_in_status from '../api/check_logged_in_status';
import { useState, useEffect } from 'react';

function RequireAuth({ children }) {
  let location = useLocation();
  const [datastate, setDatastate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    check_logged_in_status().then((result) => {
      if (isMounted) {
        setDatastate(result);
        console.log('result ', result);
        if (result === null || result === undefined) {
          navigate('/login', { state: { from: location.pathname } });
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, [datastate, location.pathname, navigate]);

  return datastate === 'LOGGED' && children;
}

export default RequireAuth;
