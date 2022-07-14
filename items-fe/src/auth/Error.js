import React from 'react';

const Error = () => {
  return (
    <div className="conatiner" id="container_form">
      <label htmlFor="submitButton>" id="submitLabel">
        The email we sent you with access token for <br />
        signing up has been expired. <br />
        <br />
        Please, click the Signup link up right corner again <br />
        and request another access token to be emailed to you.
      </label>
    </div>
  );
};

export default Error;
