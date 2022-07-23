import axios from 'axios';
import { LOGOUT_URL } from '../constants';

const logout_api = async () => {
  let response = await axios.post(LOGOUT_URL, {
    headers: {
      'Content-Type': 'application/json',
      access_token: `Bearer ${localStorage.getItem('access_token')}`,
    },
  });
  if (response.status === 202) {
    console.log('Logged out');
    localStorage.clear();
  } else {
    console.log('login out failed ', response.status);
  }
};

export default logout_api;
