import useAxiosFetch from '../hooks/useAxiosFetch';
import { useLocation, useNavigate } from 'react-router-dom';
import { CHECK_IF_TOKEN_EXPIRED } from '../constants';
import { useEffect, useState } from 'react';

function RequireAuth({ children }) {
  const [datastate, setDatastate] = useState('');
  const { data } = useAxiosFetch(CHECK_IF_TOKEN_EXPIRED);
  let location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('data ', data);
    setDatastate(data);
    if (datastate === null || datastate === undefined) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [data, datastate, location.pathname, navigate]);

  // if (datastate === null || datastate === undefined) {
  //   // Redirect them to the /login page, but save the current location they were
  //   // trying to go to when they were redirected. This allows us to send them
  //   // along to that page after they login, which is a nicer user experience
  //   // than dropping them off on the home page.
  //   // return <Navigate to="/login" state={{ from: location.pathname }} />;
  //   navigate('/login', { state: { from: location.pathname } });
  // }
  return (
    datastate !== null && datastate !== '' && datastate.length !== 0 && children
  );
}

export default RequireAuth;
