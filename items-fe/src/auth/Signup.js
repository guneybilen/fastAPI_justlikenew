import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

let backend = '/securityquestions/';

const Signup = () => {
  const scrollRef = useRef(null);

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
  const [ckbox, setCkbox] = useState(false);
  const [show, setShow] = useState(false);

  const scrollTo = (ref) => {
    if (ref && ref.current /* + other conditions */) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const grab = async () => {
      const result = await axios.get(backend);
      // console.log(result.data);
      setNames(result.data.names);
      setValues(result.data.values);
    };

    grab();
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    setAlert('');
    setShow(true);
    document
      .getElementsByClassName('signupForm')[0]
      .classList.remove('signupForm-enabled');

    const user = {
      email: email,
      password: password1,
      passwordConfirm: password2,
      nickname: nickname,
      s_name: forsend,
      s_answer: answer,
    };

    let url = '/users/';

    axios
      .post(url, user, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        console.log(data);

        if (data.id) {
          setShow(false);
          setError(true);
          scrollTo(scrollRef);
          setAlert(
            'Please, check your inbox and (spam folder as well) and activate your account'
          );
        }
      })
      .catch((error) => {
        setShow(false);
        document
          .getElementsByClassName('signupForm')[0]
          .classList.add('signupForm-enabled');
        console.log(error.response);
        setForSend('');
        setError(true);
        setAlert(error.response.data.message);
        scrollTo(scrollRef);
      });
  };

  const displayNone = (e) => {
    e.preventDefault();
    setError(false);
    setAlert('');
  };

  const timeRequest = (e) => {
    if (!e.target.checked) {
      document
        .getElementsByClassName('signupForm')[0]
        .classList.remove('signupForm-enabled');
    }
    setShow(true);

    setTimeout(() => {
      setCkbox(e.target.checked);
      setShow(false);
      if (e.target.checked) {
        document
          .getElementsByClassName('signupForm')[0]
          .classList.add('signupForm-enabled');
      }
    }, 2000);
  };

  return (
    <>
      {show && (
        <div
          className="spinner-border text-primary"
          role="status"
          onClick={(e) => displayNone(e)}
        />
      )}
      <div className="ckbox">
        <input
          type="checkbox"
          id="human"
          className="humancheckbox"
          required
          value={ckbox}
          onChange={(e) => {
            timeRequest(e);
          }}
        />
        <label htmlFor="submitButton>" id="submitLabel">
          please, check to ensure we are interacting with a human
        </label>
      </div>
      <br />
      <main className="SignupPage text-center">
        {error && (
          <div className="alert" id="id001" ref={scrollRef}>
            <span className="closebtn" onClick={(e) => displayNone(e)}>
              &times;
            </span>
            <strong>{error ? error : ''}</strong>
            <strong>{alert ? alert : ''}</strong>
          </div>
        )}

        <form onSubmit={onSubmit} className="signupForm">
          <div>
            <br />
            <label htmlFor="email" className="form-label">
              Email Address:
            </label>{' '}
            <br />
            <input
              name="email"
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />{' '}
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
              Confirm Password:
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
            <label htmlFor="nickname" className="form-label">
              Nickname:
            </label>{' '}
            <br />
            <input
              name="nickname"
              type="text"
              value={nickname}
              className="form-control"
              onChange={(e) => setNickname(e.target.value)}
              required
            />
            <br />
            <label htmlFor="security_question" className="form-label">
              Pick One For Your Security Question:
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
              Type Your Answer For The Selected Security Question:
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
              value="Signup"
              className="btn btn-primary btn-lg w-100"
            />
          </div>
        </form>
      </main>
    </>
  );
};

export default Signup;
