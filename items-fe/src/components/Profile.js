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
  const [securityQuestionGoingToServer, setSecurityQuestionGoingToServer] =
    useState('');
  const [securityAnswerGoingToServer, setSecurityAnswerGoingToServer] =
    useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [username, setUserName] = useState('');
  const [alert, setAlert] = useState('');
  const [show, setShow] = useState(false);
  const [names, setNames] = useState([]);
  const [values, setValues] = useState([]);

  const scrollTo = (ref) => {
    if (ref && ref.current /* + other conditions */) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
        setSecurityQuestionGoingToServer(response.data['security_name']);
        setUserName(response.data['username']);
        document.getElementById('password1').value = '';
        document.getElementById('password2').value = '';
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    axios
      .get(SECURITY_ENUM_URL, {
        headers: {
          'Content-Type': 'application/json',
          access_token: localStorage.getItem('access_token'),
        },
      })
      .then((response) => {
        setNames(Object.keys(response.data));
        setValues(Object.values(response.data));
      })
      .catch((error) => console.log(error));
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    setShow(true);

    const data = {
      email: email,
      password: password1,
      password_confirm: password2,
      username: username,
      security_name: securityQuestionGoingToServer,
      security_answer: securityAnswerGoingToServer,
    };

    updateUser({
      user: data,
      cb: (username, EMAIL_CHANGED, result) => {
        // console.log(result);
        setError(true);
        localStorage.setItem('loggedin_username', username);
        if (EMAIL_CHANGED) {
          setAlert(
            'Please confirm with the email send to your new email address'
          );
          scrollTo(scrollRef);
          setShow(false);
        }
        if (result) {
          setAlert(result);
          scrollTo(scrollRef);
          setShow(false);
        } else {
          setAlert('Profile updating completed. You can click a link.');
          scrollTo(scrollRef);
          setShow(false);
        }
      },
      err: (error) => {
        console.log(error);
        setShow(false);
        setError(true);
        setAlert(error);
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
            />{' '}
            <br />
            <label htmlFor="password1" className="form-label">
              Change Password:
            </label>{' '}
            <br />
            <input
              name="password1"
              id="password1"
              type="password"
              className="form-control"
              autoComplete="Off"
              value={password1}
              onClick={() => setPassword1('')}
              onChange={(e) => setPassword1(e.target.value)}
            />{' '}
            <br />
            <label htmlFor="password2" className="form-label" required>
              Confirm Password:
            </label>{' '}
            <br />
            <input
              name="password2"
              id="password2"
              type="password"
              className="form-control"
              autoComplete="Off"
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
            <select
              id="security_question"
              className="form-select"
              aria-label="Default select example"
              value={securityQuestionGoingToServer}
              onChange={(e) => setSecurityQuestionGoingToServer(e.target.value)}
            >
              <>
                <option value={names[0]}>{values[0]}</option>
                <option value={names[1]}>{values[1]}</option>
                <option value={names[2]}>{values[2]}</option>
                <option value={names[3]}>{values[3]}</option>
                <option value={names[4]}>{values[4]}</option>
                <option value={names[5]}>{values[5]}</option>
              </>
            </select>
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
