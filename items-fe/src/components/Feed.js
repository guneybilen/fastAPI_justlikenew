import Item from './Item';

const Feed = ({ items: searchItems, users }) => {
  return (
    <>
      {users.map((user) => (
        <Item key={user.id} searchItems={searchItems} users={users} />
      ))}
    </>
  );
};

export default Feed;
