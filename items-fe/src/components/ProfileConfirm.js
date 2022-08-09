import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SECURITY_ENUM_URL, GET_SECURITY_ENUM_URL } from '../constants';
import { useStoreActions } from 'easy-peasy';

const Profile = () => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityDataComingFromServer, setSecurityDataComingFromServer] =
    useState([]);
  const [securityQuestionGoingToServer, setSecurityQuestionGoingToServer] =
    useState('');
  const [securityAnswerGoingToServer, setSecurityAnswerGoingToServer] =
    useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [username, setUserName] = useState('');
  const [passwordAltered, setPasswordAltered] = useState(true);
  const [passwordChangeInfo, setPasswordChangeInfo] = useState(null);
  const [alert, setAlert] = useState('');
  const [show, setShow] = useState(false);

  // const scrollTo = (ref) => {
  //   if (ref && ref.current /* + other conditions */) {
  //     ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  //   }
  // };

  const updateUser = useStoreActions((actions) => actions.updateUser);

  useEffect(() => {
    axios
      .get(GET_SECURITY_ENUM_URL, {
        headers: {
          'Content-Type': 'application/json',
          access_token: localStorage.getItem('access_token'),
        },
      })
      .then((response) => {
        setEmail(response.data['email']);
        setSecurityQuestion(response.data['security_name']);
        setUserName(response.data['username']);
        setPasswordChangeInfo(localStorage.getItem('password'));
        setPasswordAltered(localStorage.getItem('passwordAltered'));
        setEmail(localStorage.getItem('email'));
        if (passwordAltered) {
          setPasswordChangeInfo(
            'Password changed but you can not see the password here due to security matters.'
          );
        } else {
          setPasswordChangeInfo('Password has not been altered.');
        }
        setUserName(localStorage.getItem('username'));
        setSecurityQuestionGoingToServer(localStorage.getItem('security_name'));
        setSecurityAnswerGoingToServer(localStorage.getItem('security_answer'));
      })
      .catch((error) => console.log(error));
  }, [passwordAltered]);

  useEffect(() => {
    axios
      .get(SECURITY_ENUM_URL, {
        headers: {
          'Content-Type': 'application/json',
          access_token: localStorage.getItem('access_token'),
        },
      })
      .then((response) => {
        // console.log(response.data);
        setSecurityDataComingFromServer(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    setShow(true);

    const user = {
      email: email,
      password: password1,
      passwordConfirm: password2,
      username: username,
      security_name: securityQuestionGoingToServer,
      security_answer: securityAnswerGoingToServer,
    };

    updateUser({
      user: user,
      cb: () => {
        navigate('/');
      },
      err: (error) => {
        console.log(error);
        setError(error);
      },
    });
  };

  const displayNone = (e) => {
    e.preventDefault();

    setError(false);
    setAlert('');
  };

  return (
    <>
      {show && (
        <div
          className="spinner-grow text-primary"
          role="status"
          onClick={(e) => displayNone(e)}
        />
      )}
      <main className="SignupPage text-center">
        {error && (
          <div className="alert" id="id001" ref={scrollRef}>
            <span className="closebtn" onClick={(e) => displayNone(e)}>
              &times;
            </span>
            <strong>{alert}</strong>
          </div>
        )}
        <br />
        <span>
          <h3>Confirmation Page</h3>
        </span>
        <br />
        <form onSubmit={onSubmit} id="profileForm">
          <div>
            <br />
            <label htmlFor="email" className="form-label">
              Update Email Address:
            </label>{' '}
            <br />
            <input
              name="email"
              type="email"
              className="form-control"
              placeholder="example@example.com"
              id="emailField"
              value={email}
              onClick={() => setEmail('')}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <span>
              <label>{passwordChangeInfo ? passwordChangeInfo : ''}</label>
            </span>
            <br />
            <label htmlFor="password1" className="form-label">
              Change Password:
            </label>{' '}
            <br />
            <input
              name="password1"
              type="password"
              className="form-control"
              value={password1}
              onClick={() => setPassword1('')}
              autoComplete="off"
              onChange={(e) => setPassword1(e.target.value)}
            />{' '}
            <br />
            <label htmlFor="password2" className="form-label" required>
              Confirm Password:
            </label>{' '}
            <br />
            <input
              name="password2"
              autoComplete="off"
              type="password"
              className="form-control"
              value={password2}
              onClick={() => setPassword2('')}
              onChange={(e) => setPassword2(e.target.value)}
            />{' '}
            <br />
            <label htmlFor="username" className="form-label">
              Change Username:
            </label>{' '}
            <br />
            <input
              name="username"
              type="text"
              value={username}
              className="form-control"
              onChange={(e) => setUserName(e.target.value)}
            />
            <br />
            <br />
            <span>
              <label>
                Your Current Security Question is: {securityQuestion}
              </label>
            </span>
            <br />
            <br />
            <label htmlFor="security_question" className="form-label">
              Update For Your Security Question:
            </label>
            <br />
            {securityDataComingFromServer && (
              <select
                id="security_question"
                className="form-select"
                aria-label="Default select example"
                value={securityQuestionGoingToServer}
                onChange={(e) =>
                  setSecurityQuestionGoingToServer(e.target.value)
                }
              >
                <>
                  <option value="">Choose one from the list</option>
                  <option value={securityDataComingFromServer['BORN_CITY']}>
                    {securityDataComingFromServer['BORN_CITY']}
                  </option>
                  <option value={securityDataComingFromServer['FAVORITE_FOOD']}>
                    {securityDataComingFromServer['FAVORITE_FOOD']}
                  </option>
                  <option value={securityDataComingFromServer['FAVORITE_PET']}>
                    {securityDataComingFromServer['FAVORITE_PET']}
                  </option>
                  <option value={securityDataComingFromServer['FIRST_CAR']}>
                    {securityDataComingFromServer['FIRST_CAR']}
                  </option>
                  <option
                    value={
                      securityDataComingFromServer['GRADUATED_HIGH_SCHOOL_NAME']
                    }
                  >
                    {securityDataComingFromServer['GRADUATED_HIGH_SCHOOL_NAME']}
                  </option>
                  <option
                    value={securityDataComingFromServer['MOTHER_MAIDEN_NAME']}
                  >
                    {securityDataComingFromServer['MOTHER_MAIDEN_NAME']}
                  </option>
                </>
              </select>
            )}
            <br />
            <label htmlFor="security_question_answer" className="form-label">
              Type Your Answer For The Updated Security Question:
            </label>
            <br />
            <input
              name="sqanswer"
              id="security_question_answer"
              type="text"
              value={securityAnswerGoingToServer}
              className="form-control"
              onChange={(e) => setSecurityAnswerGoingToServer(e.target.value)}
            />
            <br />
            <br />
            <input
              type="submit"
              value="Update Profile"
              className="btn btn-primary btn-lg w-100"
            />
            <br />
            <br />
            <input
              type="button"
              value="Cancel"
              className="btn btn-secondary btn-lg w-100"
              onClick={() => navigate('/')}
            />
          </div>
        </form>
      </main>
    </>
  );
};

export default Profile;
