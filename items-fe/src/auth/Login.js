import React, { useState, useRef, useEffect } from 'react';
import login_api from '../api/login_api';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
// import axios from 'axios';
import { useLocation } from 'react-router-dom';

export default function Login() {
  const myRef = useRef(null);
  const nav = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [alert, setAlert] = useState('');
  // const [link, setLink] = useState(false);
  const [ckbox, setCkbox] = useState(false);
  const [show, setShow] = useState(false);
  const { state } = useLocation();

  const from = state === null ? '/' : state.from;

  useEffect(() => {
    document.getElementById('sbn-btn').disabled = true;
    document.getElementById('sbn-pass').disabled = true;
    document.getElementById('username').style.pointerEvents = 'none';
  }, [state]);

  // const requestActivation = (e) => {
  //   e.preventDefault();
  //   let url = '/repeatactivate/';

  //   axios
  //     .post(
  //       url,
  //       { username: username },
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       return response.data;
  //     })
  //     .then((data) => {
  //       console.log('data ' + data);
  //       if (data.state) {
  //         setError(true);
  //         setAlert(data.state);
  //         scrollTo(myRef);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error.response);
  //       setError(true);
  //       setAlert(error.response.data.message);
  //       scrollTo(myRef);
  //     });
  // };

  const scrollTo = (ref) => {
    if (ref && ref.current /* + other conditions */) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const success = () => {
    console.log('Authenticated!');
    // console.log(from);
    nav(from);
  };

  const fail = (status) => {
    console.log('Authentication Failed!');
    // console.log(status);
    localStorage.clear();
    scrollTo(myRef);
    if (status.status === 401) setAlert(status.data.detail);
    // if (status === 403) {
    //   setLink(true);

    //   setAlert(
    //     'You need to activate your account in order to authorize. You can request another activtion email from the link below'
    //   );
    // }
    if (status === 500) setAlert('a problem in the server occurred');
  };

  const tryLogin = async (e) => {
    e.preventDefault();
    let form_data = new FormData();
    form_data.append('username', username);
    form_data.append('password', password);
    await login_api(form_data, success, fail);
  };

  const displayNone = (e) => {
    e.preventDefault();
    setError(false);
  };

  const timeRequest = (e) => {
    if (!e.target.checked) {
      document.getElementById('sbn-btn').disabled = true;
      document.getElementById('sbn-pass').disabled = true;
      document.getElementById('username').style.pointerEvents = 'none';
    }
    setShow(true);

    setTimeout(() => {
      setCkbox(e.target.checked);
      setShow(false);
      if (e.target.checked) {
        document.getElementById('sbn-btn').disabled = false;
        document.getElementById('sbn-pass').disabled = false;
        document.getElementById('username').style.pointerEvents = 'auto';
      }
    }, 2000);
  };

  return (
    <main className="LoginPage text-center">
      {show && (
        <div
          className="spinner-border text-primary"
          role="status"
          onClick={(e) => displayNone(e)}
        />
      )}
      {(error || alert?.length > 0) && (
        <div className="alert" id="id001" ref={myRef}>
          <span className="closebtn" onClick={(e) => displayNone(e)}>
            &times;
          </span>
          <strong>{error ? error : <></>}</strong>
          <strong>{alert ? alert : <></>}</strong>
        </div>
      )}
      <form>
        <br />
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Email
          </label>
          <input
            autoFocus
            type="email"
            className="form-control"
            required
            id="username"
            placeholder="example@example.com"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            value={username}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="sbn-pass" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="sbn-pass"
            placeholder="password"
            required
            autoComplete="on"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value={password}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary btn-lg w-100"
          id="sbn-btn"
          onClick={tryLogin}
        >
          Login
        </button>
        <br />
        <br />
        {/* {link ? (
          <button
            className="btn btn-primary btn-lg w-100"
            onClick={(e) => requestActivation(e)}
          >
            Request Activation Email
          </button>
        ) : (
          <></>
        )} */}
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
        <br />
        <Link to="/forgotpassword">Forgot Password</Link>
      </form>
    </main>
  );
}
