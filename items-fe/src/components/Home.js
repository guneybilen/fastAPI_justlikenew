import Feed from './Feed';
import { useEffect, useState } from 'react';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  ITEMS_ALL,
  ALL_USERS_ITEMS_URL,
  SPECIFIC_USER_ITEM_URL,
} from '../constants';
import axios from 'axios';

const Home = ({ isLoading, fetchError }) => {
  const current_url = window.location.href;
  const { user_id } = useParams();
  const { item_id } = useParams();
  const [data, setData] = useState([]);

  const match_result_for_items_url = useMemo(() => {
    const items_url = /\/items\//g;
    return current_url.match(items_url);
  }, [current_url]);

  const match_result_for_user_items_url = useMemo(() => {
    const user_items_url = /\/user_items\//g;
    return current_url.match(user_items_url);
  }, [current_url]);

  useEffect(() => {
    if (match_result_for_user_items_url) {
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

    if (match_result_for_items_url) {
      axios
        .get(SPECIFIC_USER_ITEM_URL + item_id, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          setData([response.data]);
        })
        .catch((error) => console.log(error));
    } else {
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
    }
  }, [
    item_id,
    match_result_for_items_url,
    match_result_for_user_items_url,
    user_id,
  ]);

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
