import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { SECURITY_ENUM_URL, USER_CREATE_URL } from '../constants';

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
  const [username, setUsername] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [alert, setAlert] = useState('');
  const [ckbox, setCkbox] = useState(false);
  const [show, setShow] = useState(false);

  const scrollTo = (ref) => {
    if (ref && ref.current /* + other conditions */) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const grab_security_enum = async () => {
      const result = await axios.get(SECURITY_ENUM_URL);
      setNames(Object.keys(result.data));
      setValues(Object.values(result.data));
    };

    const grab_email = async () => {
      const result = await axios.get(SECURITY_ENUM_URL);
      setEmail(result.config.email);
    };

    grab_security_enum();
    grab_email();
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    setAlert('');
    setShow(true);
    document
      .getElementsByClassName('signupForm')[0]
      .classList.remove('signupForm-enabled');

    let form_data = new FormData();

    form_data.append('email', email);
    form_data.append('password', password1);
    form_data.append('username', username);
    form_data.append('firstname', firstname);
    form_data.append('lastname', lastname);
    form_data.append('security_name', forsend);
    form_data.append('security_answer', answer);

    axios
      .post(
        USER_CREATE_URL,

        JSON.stringify({
          email: email,
          password: password1,
          username: username,
          first_name: firstname,
          last_name: lastname,
          security_name: forsend,
          security_answer: answer,
        }),

        // { data: { form_data: JSON.stringify(form_data) } },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
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
            {/* For My Information: No onChange() event handler for the email 
            input field below, # since email is coming from the server as a
            response to email sent to inbox of the # prospective user. */}
            <input
              name="email"
              type="email"
              className="form-control"
              value={email}
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
            <label htmlFor="username" className="form-label">
              Username:
            </label>{' '}
            <br />
            <input
              name="username"
              type="text"
              value={username}
              className="form-control"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <br />
            <label htmlFor="firstname" className="form-label">
              First name:
            </label>{' '}
            <br />
            <input
              name="firstname"
              type="text"
              value={firstname}
              className="form-control"
              onChange={(e) => setFirstname(e.target.value)}
              required
            />
            <br />
            <br />
            <label htmlFor="lastname" className="form-label">
              Last name:
            </label>{' '}
            <br />
            <input
              name="lastname"
              type="text"
              value={lastname}
              className="form-control"
              onChange={(e) => setLastname(e.target.value)}
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
