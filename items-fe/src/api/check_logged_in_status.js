import axios from 'axios';
import { CHECK_IF_TOKEN_EXPIRED } from '../constants';

const check_logged_in_status = async () => {
  const location = window.location;
  if (location.toString().indexOf('/signup') !== -1) {
    console.log('returning b/c route is coming from signup location');
    return null;
  } else {
    console.log('location' + location);
    let response = await axios.get(CHECK_IF_TOKEN_EXPIRED, {
      headers: {
        'Content-Type': 'application/json',
        access_token: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (response.data?.status === 205) {
      console.log('No content - Logged out status');
      localStorage.clear();
    }
  }
};

export default check_logged_in_status;
