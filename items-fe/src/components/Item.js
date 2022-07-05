import { Link } from 'react-router-dom';
import { formatDistance, subDays, parseISO } from 'date-fns';
import { DefaultEditor } from 'react-simple-wysiwyg';
import { IMAGES_URL } from '../constants';

const Item = ({ item }) => {
  // let dt = format(parseISO(item.created_date), 'MMMM dd, yyyy pp');

  const dt = formatDistance(
    subDays(new Date(), 3),
    parseISO(item.created_date),
    { addSuffix: true }
  );
  // let dt = formatDistance(new Date(), parseISO(item.createdAt));

  // console.log(item);

  const getItemBrand = () => {
    return item['items'].map((singleItem) => {
      return singleItem.brand.length < 16
        ? singleItem.brand
        : singleItem.brand?.slice(0, 15);
    });
  };

  const getItemModel = () => {
    return item['items'].map((singleItem) => {
      return singleItem.model.length < 16
        ? singleItem.model
        : singleItem.model?.slice(0, 15);
    });
  };

  const getItemPrice = () => {
    return item['items'].map((singleItem) => {
      return singleItem.price ? 'CAD$' + singleItem.price : '';
    });
  };

  const getItemDescription = () => {
    return item['items'].map((singleItem) => {
      return singleItem.description?.length < 25
        ? singleItem.description
        : singleItem.description?.slice(0, 25);
    });
  };

  // You may need the following code in ItemPage.js
  //
  //
  // const getItemImages = () => {
  //   return item['items'].map((singleItem) => {
  //     return singleItem['items'].map((img, index) => {
  //       return img['images'].map((singleImage, index) => {
  //         return singleImage.item_image[index]
  //           ? singleImage.item_image[index]
  //           : '';
  //       });
  //     });
  //   });
  // };

  const getItemImages = () => {
    return item['items'].map((img) => {
      return img['images'].map((singleImage) => {
        return singleImage.item_image1 ? singleImage.item_image1 : '';
      });
    });
  };

  return (
    <>
      <article className="item">
        {getItemBrand()}
        <br />
        {getItemModel()}
        <br />

        {getItemPrice()}
        <br />

        {getItemDescription()}
        <br />

        <img
          src={IMAGES_URL + item.username + '1/' + getItemImages()}
          alt="1"
          className={
            !!getItemImages() === false ? 'itemImageonError' : 'mainPageImage'
          }
        />

        <br />
        <br />

        <Link to={`item/${item.id}/`} className="item-link">
          <p className="postDate">...{dt}</p>
        </Link>
      </article>
    </>
  );
};

export default Item;
