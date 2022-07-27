import Item from './Item';

const Feed = ({ searchItems }) => {
  let owner_object_needs_parsing = searchItems.pop();
  let owner_object_parsed = owner_object_needs_parsing
    ? owner_object_needs_parsing['owner']
    : '';
  return (
    <>
      {searchItems.length > 0
        ? searchItems.map((searchItem) => (
            <Item
              key={searchItem.id}
              searchItem={searchItem}
              owner_object_parsed={owner_object_parsed}
            />
          ))
        : 'Loading ...'}
    </>
  );
};

export default Feed;
