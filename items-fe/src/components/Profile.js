import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import logout_api from '../api/logout_api';

let backend = '/securityquestions/';

const Profile = () => {
  const scrollRef = useRef(null);
  const history = useNavigate();

  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const [names, setNames] = useState([]);
  const [values, setValues] = useState([]);
  const [forsend, setForSend] = useState('');
  const [answer, setAnswer] = useState('');

  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [nickname, setNickname] = useState('');
  const [alert, setAlert] = useState('');
  const [show, setShow] = useState(false);

  const scrollTo = (ref) => {
    if (ref && ref.current /* + other conditions */) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    setEmail('');
    setPassword1('');
    setPassword2('');
    setNickname('');
    setForSend('');
    setAnswer('');

    const grab = async () => {
      const result = await axios.get(backend);
      setNames(result.data.names);
      setValues(result.data.values);
    };

    grab();
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    setShow(true);
    const user = {
      pk: localStorage.getItem('loggedInId'),
      email: email,
      password: password1,
      passwordConfirm: password2,
      nickname: nickname,
      security_name: forsend,
      security_answer: answer,
    };

    let url = '/updateuser/';

    axios
      .patch(url, user, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        console.log(data);
        localStorage.setItem('nickname', data.nickname);
        setShow(true);
        if (data.id) {
          history('/');
        }
      })
      .catch((error) => {
        console.log(error.response);
        setShow(false);
        setForSend('');
        setError(true);
        setAlert(error.response.data.message);
        scrollTo(scrollRef);
        document.getElementById('profileForm').reset();
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
            <label htmlFor="nickname" className="form-label">
              Change Nickname:
            </label>{' '}
            <br />
            <input
              name="nickname"
              type="text"
              value={nickname}
              className="form-control"
              onChange={(e) => setNickname(e.target.value)}
            />
            <br />
            <label htmlFor="security_question" className="form-label">
              Update For Your Security Question:
            </label>
            <select
              id="security_question"
              className="form-select"
              aria-label="Default select example"
              value={forsend}
              onChange={(e) => setForSend(e.target.value)}
            >
              <>
                <option value="">Choose one from the list</option>
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
              value={answer}
              className="form-control"
              onChange={(e) => setAnswer(e.target.value)}
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
              onClick={() => history('/')}
            />
          </div>
        </form>
      </main>
    </>
  );
};

export default Profile;
