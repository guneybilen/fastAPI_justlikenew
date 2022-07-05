import { formatDistance, parseISO } from 'date-fns';

export const getUserId = (users) => {
  return users.map((singleUser) => {
    return singleUser.id;
  });
};

export const getItemCreatedDate = (users) => {
  return users.map((singleUser) => {
    return singleUser['items'].map((singleItem) => {
      return formatDistance(new Date(), parseISO(singleItem.created_date));
    });
  });
};

export const getItemBrand = (users) => {
  return users.map((singleUser) => {
    return singleUser['items'].map((singleItem) => {
      return singleItem.brand.length < 16
        ? singleItem.brand
        : singleItem.brand?.slice(0, 15);
    });
  });
};

export const getItemModel = (users) => {
  return users.map((singleUser) => {
    return singleUser['items'].map((singleItem) => {
      return singleItem.model.length < 16
        ? singleItem.model
        : singleItem.model?.slice(0, 15);
    });
  });
};

export const getItemPrice = (users) => {
  return users.map((singleUser) => {
    return singleUser['items'].map((singleItem) => {
      return singleItem.price ? 'CAD$' + singleItem.price : '';
    });
  });
};

export const getItemDescription = (users) => {
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

export const getUserUserName = (users) => {
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

// const getItemImages = () => {
//   return users.map((singleUser) => {
//     return singleUser['items'].map((img) => {
//       return img['images'].map((singleImage) => {
//         return singleImage.item_image1 ? singleImage.item_image1 : '';
//       });
//     });
//   });
// };
