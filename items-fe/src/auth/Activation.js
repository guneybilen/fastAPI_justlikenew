import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function Activation() {
  const [error, setError] = useState(false);
  const [alert, setAlert] = useState('');

  let { token } = useParams();

  let url = `/activateaccount/${token}/`;

  useEffect(() => {
    const grab = async () => {
      const result = axios
        .post(url, {
          token: token,
        })
        .then((response) => {
          return response.data;
        })
        .then((data) => {
          console.log(data);
          setAlert(data.state);
        })
        .catch((error) => {
          console.log(error.response.state);
          setError(true);
          setAlert(error.response.data.state);
        });
      console.log(result.data);
      return;
    };
    if (token?.length > 0) {
      grab();
    }
  }, [url, token]);

  const displayNone = (e) => {
    e.preventDefault();
    setError(false);
  };

  return (
    <main className="LoginPage text-center">
      {(error || alert?.length > 0) && (
        <div className="alert" id="id001">
          <span className="closebtn" onClick={(e) => displayNone(e)}>
            &times;
          </span>
          <strong>{error ? error : <></>}</strong>
          <strong>{alert ? alert : <></>}</strong>
        </div>
      )}
      <Link to="/login">Log in</Link>
    </main>
  );
}
