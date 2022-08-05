import Feed from './Feed';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ITEMS_ALL, PARTICULAR_URL } from '../constants';
import axios from 'axios';

const Home = ({ isLoading, fetchError }) => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  // console.log('id ', id);

  useEffect(() => {
    if (id === null || id === undefined) {
      axios
        .get(ITEMS_ALL, {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
            Expires: '0',
          },
        })
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => console.log(error));
    } else {
      axios
        .get(PARTICULAR_URL + id, {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
            Expires: '0',
          },
        })
        .then((response) => {
          setData([response.data]);
        })
        .catch((error) => console.log(error));
    }
  }, [id]);

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
