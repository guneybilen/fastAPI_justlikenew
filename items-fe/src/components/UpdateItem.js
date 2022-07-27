// import React, { useEffect } from 'react';
// import { useState, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import { useStoreState } from 'easy-peasy';
// import { DefaultEditor } from 'react-simple-wysiwyg';
// import { ITEMS_URL } from '../constants';
// import axios from 'axios';

// import {
//   getItemBrandForSingleUser,
//   getItemModelForSingleUser,
//   getItemPriceForSingleUser,
//   getItemDescriptionForSingleUser,
//   getItemCreatedDateForSingleUser,
//   getItemIdForSingleUser,
//   getSellerIdForSingleUser,
//   getSellerNameForSingleUser,
//   getSellerLocationForSingleUser,
// } from '../helpers/helperFunctions';

// const getItemModelForSingleUserInput = (getModel, setModel) => {
//   return (
//     <input
//       type="text"
//       id="itemBrand"
//       required
//       value={getModel}
//       onChange={(e) => setModel(e.target.value)}
//     />
//   );
// };

// const getItemPriceForSingleUserInput = (getPrice, setPrice) => {
//   return (
//     <input
//       type="text"
//       id="itemBrand"
//       required
//       value={getPrice}
//       onChange={(e) => setPrice(e.target.value)}
//     />
//   );
// };

// const getBrandInputElement = (getBrand, setBrand) => {
//   return (
//     <input
//       type="text"
//       id="itemBrand"
//       required
//       value={getBrand === undefined ? 'hello' : getBrand}
//       onChange={(e) => setBrand(e.target.value)}
//     />
//   );
// };

// const getLocationInputElement = (getLocation, setLocation) => {
//   return (
//     <input
//       type="text"
//       id="itemBrand"
//       required
//       value={getLocation}
//       onChange={(e) => setLocation(e.target.value)}
//     />
//   );
// };

// const UpdateItem = () => {
//   const OBJECT_ACCESS_INDEX = 0;
//   const ARRAY_ACCESS_INDEX = 0;
//   const { id } = useParams();
//   const getUserById = useStoreState((state) => state.getUserById);

//   console.log(getUserById());

//   const userLocal = getUserById(id)[OBJECT_ACCESS_INDEX];

//   console.log(userLocal);

//   const scrollRef = useRef(null);

//   const formEl = useRef(null);

//   const [error, setError] = useState('');

//   const [closeButtonShouldShow, setCloseButtonShouldShow] = useState(false);

//   const [getBrand, setBrand] = useState('');
//   const [getUserLocal, setUserLocal] = useState('');
//   const [getModel, setModel] = useState('');
//   const [getPrice, setPrice] = useState('');
//   const [getItemId, setItemId] = useState('');
//   const [getURL, setURL] = useState('');
//   const [getLocation, setLocation] = useState('');

//   const [getHtmlForWYSIWYGEditor, setHtmlForWYSIWYGEditor] = useState('');

//   const [getSellerId, setSellerId] = useState(0);
//   const [getSeller, setSeller] = useState('');

//   useEffect(() => {
//     setUserLocal(userLocal);
//   }, [getUserLocal, userLocal]);

//   useEffect(() => {
//     if (getUserLocal) {
//       setHtmlForWYSIWYGEditor(
//         getItemDescriptionForSingleUser(getUserLocal)[ARRAY_ACCESS_INDEX]
//       );
//       setItemId(getItemIdForSingleUser(userLocal));
//       setBrand(getItemBrandForSingleUser(getUserLocal));
//       setURL(`update/${getUserLocal.id}`);
//       setPrice(getItemPriceForSingleUser(getUserLocal));
//       setModel(getItemModelForSingleUser(getUserLocal));
//       setSellerId(getSellerIdForSingleUser(getUserLocal));
//       setSeller(getSellerNameForSingleUser(getUserLocal));
//       setLocation(getSellerLocationForSingleUser(getUserLocal));
//     } else {
//       setHtmlForWYSIWYGEditor('');
//       setURL('');
//       setPrice('');
//       setModel('');
//       setBrand('');
//       setItemId('');
//       setLocation('');
//     }
//   }, [getUserLocal, userLocal]);

//   // console.log(getSellerId);

//   function onChange(e) {
//     setHtmlForWYSIWYGEditor(e.target.value);
//   }

//   const handleEdit = (e) => {
//     e.preventDefault();

//     alert(getBrand.toString());

//     axios
//       .put(
//         'http://localhost:8000/items/update/1',
//         {
//           id: getItemId,
//           item: {
//             brand: getBrand.toString(),
//             price: getPrice.toString(),
//             description: getHtmlForWYSIWYGEditor.toString(),
//             model: getModel.toString(),
//             location: getLocation.toString(),
//           },
//         },

//         {
//           'Content-Type': 'application/json',
//           access_token: `Bearer ${localStorage.getItem('access_token')}`,
//           // token_type: localStorage.getItem('token_type'),
//         }
//       )
//       .then(function (response) {
//         console.log(response);
//       })
//       .catch(function (response) {
//         console.log(response);
//       });
//   };

//   const displayNone = (e) => {
//     e.preventDefault();
//     setCloseButtonShouldShow(false);
//   };

//   return (
//     <main className="NewPost">
//       {error && closeButtonShouldShow && (
//         <div className="alert text-center" id="id001" ref={scrollRef}>
//           <span className="closebtn" onClick={(e) => displayNone(e)}>
//             &times;
//           </span>
//           <strong>{error}</strong>
//         </div>
//       )}
//       <h2>Update Item</h2>
//       <h5 className="">
//         ...{getUserLocal ? getItemCreatedDateForSingleUser(getUserLocal) : ''}
//       </h5>
//       <form action="#" className="newPostForm" ref={formEl}>
//         <label htmlFor="itemBrand">Brand:</label>
//         {getUserLocal && getBrandInputElement(getBrand, setBrand)}
//         <label htmlFor="itemModel">Model:</label>
//         {getUserLocal ? getItemModelForSingleUserInput(getModel, setModel) : ''}
//         <label htmlFor="itemPrice">CAD$ Price:</label>
//         {getUserLocal ? getItemPriceForSingleUserInput(getPrice, setPrice) : ''}
//         <label htmlFor="itemLocation">Location:</label>
//         {getUserLocal ? getLocationInputElement(getLocation, setLocation) : ''}
//         <label htmlFor="itemBody">
//           Description (enter your contact details, as well):
//         </label>
//         <DefaultEditor
//           value={getHtmlForWYSIWYGEditor}
//           className="form-control"
//           onChange={onChange}
//         />
//         <br />
//         <br />
//         <button
//           type="submit"
//           onClick={(e) => {
//             handleEdit(e);
//           }}
//           className="btn btn-primary btn-lg w-100"
//         >
//           Submit
//         </button>
//         <br />
//         <br />
//       </form>
//     </main>
//   );
// };

// export default UpdateItem;
