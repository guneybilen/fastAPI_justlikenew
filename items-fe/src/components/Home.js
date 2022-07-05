import Feed from './Feed';
// import { useEffect } from 'react';
import { useStoreState } from 'easy-peasy';

const Home = ({ fetchError, isLoading }) => {
  const searchResults = useStoreState((state) => state.searchResults);
  const users = useStoreState((state) => state.users);

  // useEffect(() => {
  //   console.log(users);
  // }, [users]);

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
