import axios from 'axios';
import { LOGIN_URL } from '../constants';

const login_api = async (form_data, success, fail) => {
  // const form_data = JSON.stringify({ username: username, password: password });
  await axios({
    method: 'POST',
    url: LOGIN_URL,
    data: form_data,
    'Content-Type': 'application/x-www-form-urlencoded',
  })
    .then(function (response) {
      if (response.status === 401 || response.status === 403) {
        fail(response);
      } else if (response.status === 500) {
        fail(response.data);
      } else if (response.status === 200) {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('token_type', response.data.token_type);
        // localStorage.setItem('refresh', response.data.refresh_token);
        localStorage.setItem(
          'loggedin_username',
          response.data.loggedin_username
        );
        // localStorage.setItem('loggedInId', response['user']['id']);
        success();
      }
    })
    .catch(function (error) {
      console.log('login in failed ');
      fail(error.response.status);
    });
};

export default login_api;
