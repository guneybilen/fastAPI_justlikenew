import Item from './Item';
import { useState, useEffect } from 'react';

const Feed = ({ searchItems }) => {
  // let owner_object_needs_parsing = searchItems.pop();
  // let owner_object_parsed = owner_object_needs_parsing
  //   ? owner_object_needs_parsing['owner']
  //   : '';

  const [data, setData] = useState([]);

  // let element = (searchItems && searchItems['item']) || searchItems;
  // console.log(element);

  useEffect(() => {
    setData(searchItems);
  }, [searchItems]);
  console.log(data);

  return (
    <>
      {data &&
        data.map((searchItem, index1) => {
          return searchItem.item.map((oneItem, index2) => {
            // console.log(typeof oneItem);
            return (
              <Item
                key={`${index1}${index2}`}
                searchItem={oneItem}
                userNameComing={searchItem.username}
              />
            );
          });
        })}
    </>
  );
};

export default Feed;
