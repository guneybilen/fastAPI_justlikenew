import Item from './Item';

const Feed = ({ items }) => {
  return (
    <>
      {items.map((item) => (
        <Item key={item.id} item={item} />
      ))}
    </>
  );
};

export default Feed;
