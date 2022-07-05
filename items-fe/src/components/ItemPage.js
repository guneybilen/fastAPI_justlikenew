import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { useState, useEffect } from 'react';
import { IMAGES_URL } from '../constants';

import {
  getItemBrandForSingleUser,
  getItemModelForSingleUser,
  getItemPriceForSingleUser,
  getItemDescriptionForSingleUser,
  getUserUserName,
  getUserId,
  getUser,
  getItemCreatedDateForSingleUser,
  getUserUserNameWithImages,
} from '../helpers/helperFunctions';

const ItemPage = () => {
  const { id } = useParams();
  const history = useNavigate();
  const loggedInNickname = useStoreState((state) => state.loggedInNickname);
  const loggedInID = useStoreState((state) => state.loggedInID);
  const deleteItem = useStoreActions((actions) => actions.deleteItem);
  const getUserById = useStoreState((state) => state.getUserById);

  // console.log(id);
  const users = getUserById(id)[0];
  // const user = getUserById(id)[0];
  // console.log(users);

  if (users) {
    // console.log(users.username);
    localStorage.setItem('seller', users.username);
  }

  const [itemOwner, setItemOwner] = useState(false);

  const handleDelete = (slug) => {
    let confirmation = window.confirm('Are you sure for deleting the item?');
    if (confirmation) {
      deleteItem({ id: id, username: users.username });
      history('/');
    }
  };

  useEffect(() => {
    // console.log(item.get_seller_nickname);
    if (users && users.username === localStorage.getItem('username'))
      setItemOwner(true);
  }, [users, loggedInNickname, loggedInID]);

  return (
    <main className="PostPage">
      <article className="post">
        {users && (
          <>
            <div className="h4 text-dark">
              {getItemBrandForSingleUser(users)}
              <br />
              {getItemModelForSingleUser(users)}
            </div>
            <p>{getItemPriceForSingleUser(users)}</p>
            <p>{getItemDescriptionForSingleUser(users)}</p>

            <p className="itemDate">
              ...
              {getItemCreatedDateForSingleUser(users)}
            </p>

            <span className="spanImage">
              <img
                src={
                  IMAGES_URL +
                  getUserUserNameWithImages(users)[0]['singleUserUserName'] +
                  '1/' +
                  getUserUserNameWithImages(users)[0]['singleImage1']
                }
                alt="1"
                className={
                  !!getUserUserNameWithImages(users)[0]['singleImage1'] ===
                  false
                    ? 'itemImageonError'
                    : 'itemImageSmallEdition'
                }
              />
            </span>
            <span className="spanImage">
              <img
                src={
                  IMAGES_URL +
                  getUserUserNameWithImages(users)[0]['singleUserUserName'] +
                  '1/' +
                  getUserUserNameWithImages(users)[0]['singleImage2']
                }
                alt="2"
                className={
                  !!getUserUserNameWithImages(users)[0]['singleImage2'] ===
                  false
                    ? 'itemImageonError'
                    : 'itemImageSmallEdition'
                }
              />
            </span>
            <span className="spanImage">
              <img
                src={
                  IMAGES_URL +
                  getUserUserNameWithImages(users)[0]['singleUserUserName'] +
                  '1/' +
                  getUserUserNameWithImages(users)[0]['singleImage3']
                }
                alt="3"
                className={
                  !!getUserUserNameWithImages(users)[0]['singleImage3'] ===
                  false
                    ? 'itemImageonError'
                    : 'itemImageSmallEdition'
                }
              />
            </span>
            <br />
            <br />
            {itemOwner && (
              <div className="editdeletebuttons">
                <Link to={`/edit/${users.id}`}>
                  <button className="editButton">Edit Item</button>
                </Link>
                <button
                  className="deleteButton"
                  onClick={() => handleDelete(users.id)}
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
