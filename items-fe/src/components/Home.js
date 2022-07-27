import Feed from './Feed';
import { useEffect, useState } from 'react';
import { ITEMS_ALL } from '../constants';
import axios from 'axios';

const Home = ({ fetchError, isLoading }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(ITEMS_ALL, {
        headers: {
          'Content-Type': 'application/json',
          access_token: `${localStorage.getItem('access_token')}`,
        },
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <main className="Home">
      {isLoading && <p className="statusMsg">Loading posts...</p>}
      {!isLoading && fetchError && (
        <p className="statusMsg" style={{ color: 'red' }}>
          {fetchError}
        </p>
      )}
      {data ? (
        <Feed searchItems={data} />
      ) : (
        <p className="statusMsg">No items to display.</p>
      )}
    </main>
  );
};

export default Home;
