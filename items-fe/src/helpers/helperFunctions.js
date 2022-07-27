import { formatDistance, parseISO } from 'date-fns';

export const getUser = (users) => {
  return users.map((singleUser) => {
    return singleUser;
  });
};

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

export const getItemBrand = (searchItem) => {
  return searchItem['item'].map((singleItem) => {
    return singleItem.brand.length < 16
      ? singleItem.brand
      : singleItem.brand?.slice(0, 15);
  });
};

export const getItemModel = (searchItem) => {
  return searchItem['item'].map((singleItem) => {
    return singleItem.model.length < 16
      ? singleItem.model
      : singleItem.model?.slice(0, 15);
  });
};

export const getItemPrice = (searchItem) => {
  return searchItem['item'].map((singleItem) => {
    return singleItem.price ? 'CAD$ ' + singleItem.price : '';
  });
};

export const getItemDescription = (searchItem) => {
  return searchItem['item'].map((singleItem) => {
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

export const getUserUserName = (searchItem) => {
  console.log('searchItem ', searchItem);
  return searchItem['item'].map((item) => {
    return item['image'].map((singleImage) => {
      console.log(searchItem.username);
      return {
        singleUserUserName: searchItem.username,
        singleUserItemId: item.id,
        singleImage1: singleImage.item_image1 ? singleImage.item_image1 : '',
        singleImage2: singleImage.item_image2 ? singleImage.item_image2 : '',
        singleImage3: singleImage.item_image3 ? singleImage.item_image3 : '',
      };
    });
  });
};

// export const getUserUserNameWithImages = (users) => {
//   return users['items'].flatMap((singleUser) => {
//     return singleUser['images'].flatMap((img) => {
//       return {
//         singleUserUserName: users.username,
//         singleImage1: img.item_image1 ? img.item_image1 : '',
//         singleImage2: img.item_image2 ? img.item_image2 : '',
//         singleImage3: img.item_image3 ? img.item_image3 : '',
//       };
//     });
//   });
// };

// export const getItemBrandForSingleUser = (users) => {
//   return users['items'].map((singleItem) => {
//     return singleItem.brand.length < 16
//       ? singleItem.brand
//       : singleItem.brand?.slice(0, 15);
//   });
// };

// export const getItemModelForSingleUser = (users) => {
//   return users['items'].map((singleItem) => {
//     return singleItem.model.length < 16
//       ? singleItem.model
//       : singleItem.model?.slice(0, 15);
//   });
// };

// export const getItemPriceForSingleUser = (users) => {
//   return users['items'].map((singleItem) => {
//     return singleItem.price ? singleItem.price : '';
//   });
// };

// export const getItemIdForSingleUser = (users) => {
//   return users['items'].map((singleItem) => {
//     return singleItem.id ? singleItem.id : '';
//   });
// };

// export const getItemDescriptionForSingleUser = (users) => {
//   return users['items'].map((singleItem) => {
//     return singleItem.description?.length < 25
//       ? singleItem.description
//       : singleItem.description?.slice(0, 25);
//   });
// };

export const getItemCreatedDateForSingleUser = (obj) => {
  return obj['item'][0]['image'][0]['updated_date'];
};

// export const getSellerIdForSingleUser = (users) => {
//   return users['items'].map((singleItem) => {
//     return singleItem.seller_id ? singleItem.seller_id : '';
//   });
// };

// export const getSellerLocationForSingleUser = (users) => {
//   return users['items'].map((singleItem) => {
//     return singleItem.location ? singleItem.location : '';
//   });
// };

// export const getSellerNameForSingleUser = (users) => {
//   return users.username;
// };
