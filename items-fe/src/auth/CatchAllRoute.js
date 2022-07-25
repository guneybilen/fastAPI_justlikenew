import React from 'react';
import { Link } from 'react-router-dom';

const Error = () => {
  return (
    <div className="conatiner" id="container_form">
      <label htmlFor="submitButton>" id="submitLabel">
        This a nonexistent route.
        <br />
        <Link to="/">Go back to Home</Link>
      </label>
    </div>
  );
};

export default Error;
