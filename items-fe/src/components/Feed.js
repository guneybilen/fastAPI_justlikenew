import Item from './Item';
import { useState, useEffect } from 'react';

const Feed = ({ searchItems }) => {
  // let owner_object_needs_parsing = searchItems.pop();
  // let owner_object_parsed = owner_object_needs_parsing
  //   ? owner_object_needs_parsing['owner']
  //   : '';

  const [data, setData] = useState('');

  // let element = (searchItems && searchItems['item']) || searchItems;
  // console.log(element);

  useEffect(() => {
    setData(searchItems);
  }, [searchItems]);
  console.log(data);

  return (
    <>
      {data &&
        data.map((searchItem) =>
          searchItem && searchItem.map
            ? searchItem.map((si) => (
                <Item
                  key={si.id}
                  searchItem={si}
                  usernameFromFeed={searchItem.username}
                />
              ))
            : searchItem['item'].map((el) => (
                <Item
                  key={el.id}
                  searchItem={el}
                  usernameFromFeed={searchItem.username}
                />
              ))
        )}
    </>
  );
};

export default Feed;
