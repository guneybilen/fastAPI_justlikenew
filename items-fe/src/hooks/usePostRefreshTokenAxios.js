import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
// axios.defaults.xsrfCookieName = 'csrftoken';

let backend = '';

const usePostRefreshTokenAxios = () => {
  const history = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        let response = await axios.get(`${backend}/refreshtokenview/`, {
          headers: {
            // access: `Bearer ${localStorage.getItem('access')}`,
            refresh: `Bearer ${localStorage.getItem('refresh')}`,
          },
        });

        if (response.status === 200 && response.data['nickname']) {
          localStorage.setItem('access', response.data.access_token);
          localStorage.setItem('nickname', response.data.nickname);
          localStorage.setItem('loggedInId', response.data.user_id);
        }
      } catch (e) {
        console.log(e.response.status);
        localStorage.clear();
      }
    }
    if (localStorage.getItem('refresh')) {
      fetchData();
    }
  }, [history]);
};

export default usePostRefreshTokenAxios;
