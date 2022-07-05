import { Link } from 'react-router-dom';

const Missing = () => {
  return (
    <main className="Missing">
      <h2>page not found</h2>
      <p>Well, that is dissapponting.</p>
      <p>
        <Link to="/">visit our homepage</Link>
      </p>
    </main>
  );
};

export default Missing;
