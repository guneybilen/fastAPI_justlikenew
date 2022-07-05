import { Link } from 'react-router-dom';
import {
  getItemBrand,
  getItemModel,
  getItemPrice,
  getItemDescription,
  getUserUserName,
  getUserId,
  getItemCreatedDate,
} from '../helpers/helperFunctions';

import { IMAGES_URL } from '../constants';

const Item = ({ searchItems, users }) => {
  return (
    <>
      <article className="item">
        {getItemBrand(users)}
        <br />
        {getItemModel(users)}
        <br />

        {getItemPrice(users)}
        <br />

        {getItemDescription(users)}
        <br />

        <img
          src={
            IMAGES_URL +
            getUserUserName(users)[0]['singleUserUserName'] +
            '1/' +
            getUserUserName(users)[0]['singleImage1']
          }
          alt="1"
          className={
            !!getUserUserName(users)[0]['singleImage1'] === false
              ? 'itemImageonError'
              : 'mainPageImage'
          }
        />

        <br />

        <Link
          to={`items/${getUserId(users)}`}
          className="item-link"
          state={{ from: 'occupation' }}
        >
          <p className="postDate">...{getItemCreatedDate(users)}</p>
        </Link>

        <br />
        <br />
      </article>
    </>
  );
};

export default Item;
