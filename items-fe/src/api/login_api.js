import axios from 'axios';

let server = '';

const login_api = async (username, password, success, fail) => {
  const json = JSON.stringify({ email: username, password: password });
  let response = await axios.post(`${server}/login/`, json, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.data.status === 401 || response.data.status === 403) {
    fail(response.data.status);
  } else if (response.status === 500) {
    fail(response.data);
  } else if (response.status === 200) {
    localStorage.setItem('access', response.data.access_token);
    localStorage.setItem('refresh', response.data.refresh_token);
    localStorage.setItem('nickname', response.data['user']['nickname']);
    localStorage.setItem('loggedInId', response.data['user']['id']);
    success();
  } else {
    console.log('login in failed ');
    fail(response.data);
  }
};

export default login_api;
