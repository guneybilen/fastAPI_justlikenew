import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GET_SECURITY_ENUM_URL } from '../constants';
import { PASSWORD_UPDATE } from '../constants';
import axios from 'axios';

const NewPassword = () => {
  const scrollRef = useRef(null);
  const [error, setError] = useState(false);
  const [answer, setAnswer] = useState('');
  let { token } = useParams();
  token = token ? token : window.location.pathname.split('/')[2];

  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [errors, setErrors] = useState('');
  const [secretquestion, setSecretQuestion] = useState('');

  const history = useNavigate();

  const scrollTo = (ref) => {
    if (ref && ref.current /* + other conditions */) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const grab = async () => {
      const result = axios
        .get(GET_SECURITY_ENUM_URL, {
          headers: {
            'Content-Type': 'application/json',
            access_token: token,
          },
        })
        .then((response) => {
          return response.data;
        })
        .then((data) => {
          console.log(data);
          setSecretQuestion(data.security_name);
        })
        .catch((error) => {
          console.log(error.response.state);
          setError(true);
          setErrors(error.response.data.state);
          scrollTo(scrollRef);
        });
      console.log(result.data);
      return;
    };
    grab();
  }, [token]);

  const onSubmit = (e) => {
    e.preventDefault();

    const user = {
      password: password1,
      passwordConfirm: password2,
      answer: answer,
    };

    axios
      .post(PASSWORD_UPDATE, user, {
        headers: {
          'Content-Type': 'application/json',
          access_token: token,
        },
      })
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        console.log(data);
        history('/login');
      })
      .catch((error) => {
        console.log(error);
        setError(true);
        setErrors(error.message);
        scrollTo(scrollRef);
        history('/error');
      });
  };

  const displayNone = (e) => {
    e.preventDefault();
    setError('');
  };

  return (
    <>
      <main className="SignupPage text-center">
        {error && (
          <div className="alert" id="id001" ref={scrollRef}>
            <span className="closebtn" onClick={(e) => displayNone(e)}>
              &times;
            </span>
            <strong>{errors}</strong>
          </div>
        )}
        <form onSubmit={onSubmit}>
          <div>
            <h1>Password Reset</h1>
            <br />
            <label htmlFor="password1" className="form-label">
              Password:
            </label>{' '}
            <br />
            <input
              name="password1"
              type="password"
              className="form-control"
              value={password1}
              autoComplete="on"
              onChange={(e) => setPassword1(e.target.value)}
              required
            />{' '}
            <br />
            <label htmlFor="password2" className="form-label" required>
              Confirm password:
            </label>{' '}
            <br />
            <input
              name="password2"
              autoComplete="on"
              type="password"
              className="form-control"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
            />{' '}
            <br />
            <label htmlFor="security_question" className="form-label">
              here is your recorded security question:
            </label>
            <input
              type="text"
              className="form-control"
              value={secretquestion}
              readOnly
            />
            <br />
            <label htmlFor="security_question_answer" className="form-label">
              type the answer for your recorded security question:
            </label>
            <br />
            <input
              name="sqanswer"
              id="security_question_answer"
              type="text"
              value={answer}
              className="form-control"
              onChange={(e) => setAnswer(e.target.value)}
              required
            />
            <br />
            <br />
            <input
              type="submit"
              value="Change Password"
              className="btn btn-primary btn-lg w-100"
            />
          </div>
        </form>
      </main>
    </>
  );
};

export default NewPassword;
