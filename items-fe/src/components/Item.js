import { formatDistance, parseISO } from 'date-fns';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ITEM_DELETE } from '../constants';
import { useState, useEffect } from 'react';
import { DefaultEditor } from 'react-simple-wysiwyg';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Item = ({ searchItem, userNameComing }) => {
  // console.log('searchItem ', searchItem);
  // console.log(userNameComing);
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [image_number1, set_Image1] = useState();
  const [image_number2, set_Image2] = useState();
  const [image_number3, set_Image3] = useState();
  let username = `/static/images/${userNameComing}`;
  let itemId = searchItem && searchItem.id;
  let image1 = searchItem['image'][0] && searchItem['image'][0]['item_image1'];
  let image2 = searchItem['image'][0] && searchItem['image'][0]['item_image2'];
  let image3 = searchItem['image'][0] && searchItem['image'][0]['item_image3'];

  const loc = location.pathname.match(`/user_items/${searchItem.seller_id}`);

  useEffect(() => {
    image1 &&
      set_Image1(
        `${username}${itemId}/${searchItem['image'][0]['item_image1']}`
      );
    image2 &&
      set_Image2(
        `${username}${itemId}/${searchItem['image'][0]['item_image2']}`
      );
    image3 &&
      set_Image3(
        `${username}${itemId}/${searchItem['image'][0]['item_image3']}`
      );
  }, [searchItem, username, itemId, image1, image2, image3]);

  const if_owner =
    searchItem && localStorage.getItem('loggedin_username') === userNameComing
      ? true
      : false;

  const handleDelete = (slug) => {
    let confirmation = window.confirm('Are you sure for deleting the item?');
    if (confirmation) {
      axios
        .delete(
          ITEM_DELETE,
          { item_id: searchItem[0]['id'] },
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
          {searchItem && searchItem.brand}
          <br />
          {searchItem && searchItem.model}
          <br />
          C${searchItem && searchItem.price}
          <br />
          <DefaultEditor
            value={searchItem.description}
            className="form-control-wysiwyg"
            contentEditable={false}
            readOnly={true}
          />
          <br />
          {image1 && (
            <img
              className="itemImage"
              src={image_number1}
              id="newImage1"
              alt="newImage1"
              width="150px"
              height="75px"
            />
          )}
          {image2 && (
            <img
              className="itemImage"
              src={image_number2}
              id="newImage2"
              alt="newImage2"
              width="150px"
              height="75px"
            />
          )}
          {image3 && (
            <img
              className="itemImage"
              src={image_number3}
              id="newImage3"
              alt="newImage3"
              width="150px"
              height="75px"
            />
          )}
          {searchItem && searchItem['id'] && (
            <p className="postDate">
              ...
              {formatDistance(new Date(), parseISO(searchItem.updated_date))}
            </p>
          )}
          {loc?.index === 0 ? (
            ''
          ) : (
            <Link to={`/user_items/${searchItem.seller_id}`}>goto detail</Link>
          )}
          <br />
          <br />
          {searchItem && id && if_owner && (
            <div className="editdeletebuttons">
              <Link
                to={`/edit_item/${searchItem['seller_id']}/item/${searchItem['id']}`}
              >
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
