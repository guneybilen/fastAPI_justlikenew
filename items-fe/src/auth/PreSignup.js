import React, { useState } from 'react';
import axios from 'axios';
import { PRE_CREATE_URL } from '../constants';

const PreSignup = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);

  const [alert, setAlert] = useState('');
  const [ckbox, setCkbox] = useState(false);
  const [show, setShow] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setAlert('');
    setShow(true);
    document
      .getElementsByClassName('signupForm')[0]
      .classList.remove('signupForm-enabled');

    axios
      .post(
        PRE_CREATE_URL,
        JSON.stringify({
          email: email,
        }),
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
        if (data.result) {
          // setShow(false);
          // setError(true);
          // setAlert(data.result);
          document.getElementById('resultLabel').innerHTML = data.result;
          document.getElementById('extraInfo').innerHTML =
            'You can exit this browser window now.';
          document.getElementById('human').checked = false;
          setShow(false);
        }
      })
      .catch((error) => {
        console.log(error);
        //   setShow(false);
        //   document
        //     .getElementsByClassName('signupForm')[0]
        //     .classList.add('signupForm-enabled');
        //   console.log(error.response);
        //   setError(true);
        //   setAlert(error.response.data.message);
      });
  };

  const displayNone = (e) => {
    e.preventDefault();
    setError(false);
    setAlert('');
  };

  const timeRequest = (e) => {
    document.getElementById('resultLabel').innerHTML = '';

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
    <div className="conatiner" id="container_form">
      {show && (
        <div
          className="spinner-border text-primary"
          id="spinner"
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
            onChange={(e) => {
              document.getElementById('resultLabel').innerHTML = '';
              setEmail(e.target.value);
            }}
            required
          />{' '}
          <br />
          <input
            type="submit"
            value="Signup"
            className="btn btn-primary btn-lg w-100"
          />
        </div>
      </form>
      <br />
      <br />
      <label id="resultLabel"></label>
      <br />
      <br />
      <label id="extraInfo"></label>
    </div>
  );
};

export default PreSignup;
