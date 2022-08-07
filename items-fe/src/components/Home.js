import Feed from './Feed';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  ITEMS_ALL,
  ALL_USERS_ITEMS_URL,
  SPECIFIC_USER_ITEM_URL,
} from '../constants';
import axios from 'axios';

const Home = ({ isLoading, fetchError }) => {
  const { user_id } = useParams();
  const { item_id } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    if (item_id && Number.isInteger(item_id)) {
      axios
        .get(SPECIFIC_USER_ITEM_URL + item_id, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => console.log(error));
    } else if (user_id === null || user_id === undefined) {
      axios
        .get(ITEMS_ALL, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => console.log(error));
    } else {
      axios
        .get(ALL_USERS_ITEMS_URL + user_id, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          setData([response.data]);
        })
        .catch((error) => console.log(error));
    }
  }, [user_id, item_id]);

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
