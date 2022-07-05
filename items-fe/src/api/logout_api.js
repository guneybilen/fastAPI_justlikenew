import axios from 'axios';

let origin = '';

const logout_api = async () => {
  let response = await axios.post(
    `${origin}/logout/`,
    { id: localStorage.getItem('loggedInId') },
    {
      headers: {
        'Content-Type': 'application/json',
        refresh: `Bearer ${localStorage.getItem('refresh')}`,
      },
    }
  );
  if (response.status === 202) {
    console.log('Logged out');
    localStorage.clear();
  } else {
    console.log('login out failed ', response.status);
  }
};

export default logout_api;
