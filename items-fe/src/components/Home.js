import Feed from './Feed';
import { useEffect } from 'react';
import { useStoreState } from 'easy-peasy';
import { ITEMS_ALL } from '../constants';
import axios from 'axios';

const Home = ({ fetchError, isLoading }) => {
  const searchResults = useStoreState((state) => state.searchResults);
  const users = useStoreState((state) => state.users);

  useEffect(() => {
    axios
      .get(ITEMS_ALL, {
        headers: {
          access_token: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        // setUsername(response.data.username);
        // setItemId(response.data['item'][0]['id']);
        // setBrand(response.data['item'][0]['brand']);
        // setLocation(response.data['item'][0]['location']);
        // setHtml(response.data['item'][0]['description']);
        // setPrice(response.data['item'][0]['price']);
        // setModel(response.data['item'][0]['model']);
        // setImage1(response.data['item'][0]['image'][0]['item_image1']);
        // setImage2(response.data['item'][0]['image'][0]['item_image2']);
        // setImage3(response.data['item'][0]['image'][0]['item_image3']);
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
      {!isLoading &&
      !fetchError &&
      (users.length || (searchResults && searchResults.length)) ? (
        <Feed searchItems={searchResults} users={users} />
      ) : (
        <p className="statusMsg">No items to display.</p>
      )}
    </main>
  );
};

export default Home;
