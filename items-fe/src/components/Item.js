import { Link } from 'react-router-dom';
import { formatDistance, subDays, parseISO } from 'date-fns';
// import { DefaultEditor } from 'react-simple-wysiwyg';
import { IMAGES_URL } from '../constants';

const Item = ({ searchItems, users }) => {
  // let dt = format(parseISO(item.created_date), 'MMMM dd, yyyy pp');

  // const dt = formatDistance(
  //   subDays(new Date(), 3),
  //   parseISO(item.created_date),
  //   { addSuffix: true }
  // );
  // let dt = formatDistance(new Date(), parseISO(item.createdAt));

  console.log(users);

  const getItemBrand = () => {
    return users.map((singleUser) => {
      return singleUser['items'].map((singleItem) => {
        return singleItem.brand.length < 16
          ? singleItem.brand
          : singleItem.brand?.slice(0, 15);
      });
    });
  };

  const getItemModel = () => {
    return users.map((singleUser) => {
      return singleUser['items'].map((singleItem) => {
        return singleItem.model.length < 16
          ? singleItem.model
          : singleItem.model?.slice(0, 15);
      });
    });
  };

  const getItemPrice = () => {
    return users.map((singleUser) => {
      return singleUser['items'].map((singleItem) => {
        return singleItem.price ? 'CAD$' + singleItem.price : '';
      });
    });
  };

  const getItemDescription = () => {
    return users.map((singleUser) => {
      return singleUser['items'].map((singleItem) => {
        return singleItem.description?.length < 25
          ? singleItem.description
          : singleItem.description?.slice(0, 25);
      });
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

  const getUserUserName = () => {
    return users.flatMap((singleUser) => {
      return singleUser['items'].flatMap((img) => {
        return img['images'].flatMap((singleImage) => {
          return {
            singleUserUserName: singleUser.username,
            singleImage: singleImage.item_image1 ? singleImage.item_image1 : '',
          };
        });
      });
    });
  };
  console.log(getUserUserName());

  const getItemImages = () => {
    return users.map((singleUser) => {
      return singleUser['items'].map((img) => {
        return img['images'].map((singleImage) => {
          return singleImage.item_image1 ? singleImage.item_image1 : '';
        });
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
          src={
            IMAGES_URL +
            getUserUserName()[0]['singleUserUserName'] +
            '1/' +
            getUserUserName()[0]['singleImage']
          }
          alt="1"
          className={
            !!getItemImages() === false ? 'itemImageonError' : 'mainPageImage'
          }
        />

        <br />
        <br />

        {/* <Link to={`items/${item.id}/`} className="item-link">
          <p className="postDate">...{dt}</p>
        </Link> */}
      </article>
    </>
  );
};

export default Item;
