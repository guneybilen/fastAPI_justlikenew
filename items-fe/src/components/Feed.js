import Item from './Item';
import { useState, useEffect } from 'react';

const Feed = ({ searchItems }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(searchItems);
  }, [searchItems]);

  return (
    <>
      {data &&
        data.map((searchItem, index1) => {
          return searchItem.item.map((oneItem, index2) => {
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
