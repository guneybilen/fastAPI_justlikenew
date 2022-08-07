import Feed from './Feed';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { USER_ALL_ITEMS_URL } from '../constants';
import axios from 'axios';

const UserItems = ({ isLoading, fetchError }) => {
  const { user_id } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(USER_ALL_ITEMS_URL + user_id, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        setData([response.data]);
      })
      .catch((error) => console.log(error));
  }, [user_id]);

  return (
    <main className="UserItems">
      {/* {isLoading && <p className="statusMsg">Loading posts...</p>}
      {!isLoading && fetchError && (
        <p className="statusMsg" style={{ color: 'red' }}>
          {fetchError}
        </p>
      )} */}
      {data ? (
        <Feed searchItems={data} />
      ) : (
        <p className="statusMsg">No items to display.</p>
      )}
    </main>
  );
};

export default UserItems;
