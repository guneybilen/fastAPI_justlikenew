import {
  getItemBrand,
  getItemModel,
  getItemPrice,
  getItemDescription,
  getItemCreatedDateForSingleUser,
} from '../helpers/helperFunctions';

import { formatDistance, parseISO } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { ITEM_DELETE } from '../constants';
import axios from 'axios';

const Item = ({ searchItem, owner_object_parsed }) => {
  const navigate = useNavigate();

  let username = `pictures/images/${searchItem['username']}`;
  let itemId =
    searchItem &&
    searchItem['item'] &&
    searchItem['item'][0] &&
    searchItem['item'][0]['id'];

  let image_number1 =
    searchItem &&
    searchItem['item'] &&
    searchItem['item'][0] &&
    searchItem['item'][0]['image'][0]['item_image1'];

  let image_number2 =
    searchItem &&
    searchItem['item'] &&
    searchItem['item'][0] &&
    searchItem['item'][0]['image'][0]['item_image2'];

  let image_number3 =
    searchItem &&
    searchItem['item'] &&
    searchItem['item'][0] &&
    searchItem['item'][0]['image'][0]['item_image3'];

  const if_owner =
    searchItem && owner_object_parsed === searchItem['seller_id']
      ? true
      : false;

  const handleDelete = (slug) => {
    let confirmation = window.confirm('Are you sure for deleting the item?');
    if (confirmation) {
      axios
        .delete(
          ITEM_DELETE,
          { item_id: searchItem['item'][0]['id'] },
          {
            headers: {
              'Content-Type': 'application/json',
              access_token: `${localStorage.getItem('access_token')}`,
            },
          }
        )
        .then((response) => {
          console.log('response ', response);
        })
        .catch((error) => console.log(error));
      navigate('/');
    }
  };
  return (
    <>
      {searchItem && (
        <article className="item">
          {searchItem && getItemBrand(searchItem)}
          <br />
          {searchItem && getItemModel(searchItem)}
          <br />
          {searchItem && getItemPrice(searchItem)}
          <br />
          {searchItem && getItemDescription(searchItem)}
          <br />
          {image_number1 && (
            <img
              src={`${username}${itemId}/${image_number1}`}
              className="itemImage"
              id="newImage1"
              alt="newImage1"
              width="150px"
              height="75px"
            />
          )}
          {image_number2 && (
            <img
              className="itemImage"
              src={`${username}${itemId}/${image_number2}`}
              id="newImage1"
              alt="newImage1"
              width="150px"
              height="75px"
            />
          )}
          {image_number3 && (
            <img
              className="itemImage"
              src={`${username}${itemId}/${image_number3}`}
              id="newImage1"
              alt="newImage1"
              width="150px"
              height="75px"
            />
          )}
          {searchItem &&
            searchItem['item'] &&
            searchItem['item'][0] &&
            searchItem['item'][0]['id'] &&
            image_number1 && (
              <p className="postDate">
                ...
                {formatDistance(
                  new Date(),
                  parseISO(getItemCreatedDateForSingleUser(searchItem))
                )}
              </p>
            )}
          {searchItem &&
            searchItem['item'][0] &&
            searchItem['item'][0]['id'] &&
            if_owner && (
              <div className="editdeletebuttons">
                <Link to={`/items/${searchItem['item'][0]['id']}`}>
                  <button className="editButton">Edit Item</button>
                </Link>
                <button
                  className="deleteButton"
                  onClick={() => handleDelete(searchItem['item'][0]['id'])}
                >
                  Delete Item
                </button>
              </div>
            )}
        </article>
      )}
    </>
  );
};

export default Item;
