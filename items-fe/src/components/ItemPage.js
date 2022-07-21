import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { useState, useEffect } from 'react';
import { IMAGES_URL } from '../constants';

import {
  getItemBrandForSingleUser,
  getItemModelForSingleUser,
  getItemPriceForSingleUser,
  getItemDescriptionForSingleUser,
  getItemIdForSingleUser,
  getItemCreatedDateForSingleUser,
  getUserUserNameWithImages,
} from '../helpers/helperFunctions';

const ItemPage = () => {
  const OBJECT_ACCESS_INDEX = 0;
  const { id } = useParams();
  const history = useNavigate();
  // const loggedInNickname = useStoreState((state) => state.loggedInNickname);
  // const loggedInID = useStoreState((state) => state.loggedInID);
  const deleteItem = useStoreActions((actions) => actions.deleteItem);
  const getUserById = useStoreState((state) => state.getUserById);

  const user = getUserById(id)[OBJECT_ACCESS_INDEX];

  console.log('user ', user);

  if (user) {
    localStorage.setItem('seller', user.username);
    localStorage.setItem('seller_id', user.id);
    localStorage.setItem('item_id', getItemIdForSingleUser(user));
  }

  const [itemOwner, setItemOwner] = useState(false);

  const handleDelete = (id) => {
    let confirmation = window.confirm('Are you sure for deleting the item?');
    if (confirmation) {
      deleteItem({ id: id, username: user.username });
      history('/');
    }
  };

  useEffect(() => {
    if (user && user.username === localStorage.getItem('username'))
      setItemOwner(true);
  }, [user]);

  return (
    <main className="PostPage">
      <article className="post">
        {user && (
          <>
            <div className="h4 text-dark">
              {getItemBrandForSingleUser(user)}
              <br />
              {getItemModelForSingleUser(user)}
            </div>
            <p>{getItemPriceForSingleUser(user)}</p>
            <p>{getItemDescriptionForSingleUser(user)}</p>

            <p className="itemDate">
              ...
              {getItemCreatedDateForSingleUser(user)}
            </p>

            <span className="spanImage">
              <img
                src={
                  IMAGES_URL +
                  getUserUserNameWithImages(user)[OBJECT_ACCESS_INDEX][
                    'singleUserUserName'
                  ] +
                  '1/' +
                  getUserUserNameWithImages(user)[OBJECT_ACCESS_INDEX][
                    'singleImage1'
                  ]
                }
                alt="1"
                className={
                  !!getUserUserNameWithImages(user)[OBJECT_ACCESS_INDEX][
                    'singleImage1'
                  ] === false
                    ? 'itemImageonError'
                    : 'itemImageSmallEdition'
                }
              />
            </span>
            <span className="spanImage">
              <img
                src={
                  IMAGES_URL +
                  getUserUserNameWithImages(user)[OBJECT_ACCESS_INDEX][
                    'singleUserUserName'
                  ] +
                  '1/' +
                  getUserUserNameWithImages(user)[OBJECT_ACCESS_INDEX][
                    'singleImage2'
                  ]
                }
                alt="2"
                className={
                  !!getUserUserNameWithImages(user)[OBJECT_ACCESS_INDEX][
                    'singleImage2'
                  ] === false
                    ? 'itemImageonError'
                    : 'itemImageSmallEdition'
                }
              />
            </span>
            <span className="spanImage">
              <img
                src={
                  IMAGES_URL +
                  getUserUserNameWithImages(user)[OBJECT_ACCESS_INDEX][
                    'singleUserUserName'
                  ] +
                  '1/' +
                  getUserUserNameWithImages(user)[OBJECT_ACCESS_INDEX][
                    'singleImage3'
                  ]
                }
                alt="3"
                className={
                  !!getUserUserNameWithImages(user)[OBJECT_ACCESS_INDEX][
                    'singleImage3'
                  ] === false
                    ? 'itemImageonError'
                    : 'itemImageSmallEdition'
                }
              />
            </span>
            <br />
            <br />
            {true && (
              <div className="editdeletebuttons">
                <Link to={`/update/${user.id}`}>
                  <button className="editButton">Edit Item</button>
                </Link>
                <button
                  className="deleteButton"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete Item
                </button>
              </div>
            )}
          </>
        )}
      </article>
    </main>
  );
};

export default ItemPage;
