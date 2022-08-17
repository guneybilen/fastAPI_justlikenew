import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FORGOT_PASSWORD_REQUEST_EMAIL } from '../constants';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [notification, setNotification] = useState(false);
  const [camebackdata, setCameBackData] = useState('');
  const [link, setLink] = useState(false);
  const [ckbox, setCkbox] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    localStorage.clear();
    document.getElementById('submitButton').disabled = true;
    document.getElementById('email').style.pointerEvents = 'none';
  }, []);

  const sendRequestForReset = async (e) => {
    e.preventDefault();
    axios
      .post(
        FORGOT_PASSWORD_REQUEST_EMAIL,
        { email: email },
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
        setNotification(true);
        setCameBackData('');
        setCameBackData(data.detail);
        setLink(true);
      })
      .catch((error) => {
        console.log(error.response);
        setNotification(true);
        setCameBackData(error.response.data.state);
      });
  };

  const displayNone = (e) => {
    e.preventDefault();
    setNotification(false);
  };

  const timeRequest = (e) => {
    if (!e.target.checked) {
      document.getElementById('submitButton').disabled = true;
      document.getElementById('email').style.pointerEvents = 'none';
    }
    setShow(true);

    setTimeout(() => {
      setCkbox(e.target.checked);
      setShow(false);
      if (e.target.checked) {
        document.getElementById('submitButton').disabled = false;
        document.getElementById('email').style.pointerEvents = 'auto';
      }
    }, 2000);
  };

  return (
    <>
      <main className="LoginPage text-center">
        {show && (
          <div
            className="spinner-border text-primary"
            role="status"
            onClick={(e) => displayNone(e)}
          />
        )}
        {notification && (
          <div className="alert" id="id001">
            <span className="closebtn" onClick={(e) => displayNone(e)}>
              &times;
            </span>
            <strong>{camebackdata}</strong>
          </div>
        )}
        <form>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              autoFocus
              type="email"
              className="form-control"
              required
              id="email"
              placeholder="example@example.com"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg w-100"
            onClick={sendRequestForReset}
            id="submitButton"
          >
            Send Password Reset Email
          </button>
        </form>

        <br />
        <br />

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
        {link ? <Link to="/">Goto Main Page</Link> : <></>}
      </main>
    </>
  );
}
