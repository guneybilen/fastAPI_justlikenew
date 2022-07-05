import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { formatDistance, parseISO } from 'date-fns';
import { DefaultEditor } from 'react-simple-wysiwyg';
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

const UpdateItem = () => {
  const OBJECT_ACCESS_INDEX = 0;
  const getUserById = useStoreState((state) => state.getUserById);
  const { id } = useParams();
  const user = getUserById(id)[OBJECT_ACCESS_INDEX];

  const history = useNavigate();

  const scrollRef = useRef(null);

  const formEl = useRef(null);

  const { slug } = useParams();

  const [error, setError] = useState('');
  const [closeButtonShouldShow, setCloseButtonShouldShow] = useState(false);

  const [dt, setDt] = useState('');

  const [deleteImage1, setDeleteImage1] = useState(false);
  const [deleteImage2, setDeleteImage2] = useState(false);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [imageUpload1, setImageUpload1] = useState(null);
  const [imageUpload2, setImageUpload2] = useState(null);
  const [imageUpload3, setImageUpload3] = useState(null);

  const [deleteImage3, setDeleteImage3] = useState(false);

  const [html, setHtml] = useState(`${getItemDescriptionForSingleUser(user)}`);

  const scrollTo = (ref) => {
    if (ref && ref.current /* + other conditions */) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  function onChange(e) {
    setHtml(e.target.value);
  }

  const handleEdit = (e) => {
    e.preventDefault();

    let form_data = new FormData();

    if (imageUpload1) form_data.append('item_image1', imageUpload1);
    if (imageUpload2) form_data.append('item_image2', imageUpload2);
    if (imageUpload3) form_data.append('item_image3', imageUpload3);

    form_data.append('brand', brand);
    form_data.append('price', price);
    form_data.append('entry', html);
    form_data.append('model', model);
    form_data.append('deleteImage1', deleteImage1);
    form_data.append('deleteImage2', deleteImage2);
    form_data.append('deleteImage3', deleteImage3);
    form_data.append('seller', localStorage.getItem('seller'));
    form_data.append('nickname', localStorage.getItem('nickname'));
  };
  const displayNone = (e) => {
    e.preventDefault();
    setCloseButtonShouldShow(false);
  };

  return (
    <main className="NewPost">
      {error && closeButtonShouldShow && (
        <div className="alert text-center" id="id001" ref={scrollRef}>
          <span className="closebtn" onClick={(e) => displayNone(e)}>
            &times;
          </span>
          <strong>{error}</strong>
        </div>
      )}
      <h2>Update Item</h2>
      <h5 className="">...{getItemCreatedDateForSingleUser(user)}</h5>
      <form
        action=""
        className="newPostForm"
        ref={formEl}
        encType="multipart/form-data"
      >
        <label htmlFor="itemBrand">Brand:</label>
        <input
          type="text"
          id="itemBrand"
          required
          value={getItemBrandForSingleUser(user)}
          onChange={(e) => setBrand(e.target.value)}
        />
        <label htmlFor="itemModel">Model:</label>
        <input
          type="text"
          id="itemModel"
          required
          value={getItemModelForSingleUser(user)}
          onChange={(e) => setModel(e.target.value)}
        />
        <label htmlFor="itemPrice">CAD$ Price:</label>
        <input
          type="text"
          id="itemPrice"
          value={getItemPriceForSingleUser(user)}
          onChange={(e) => setPrice(e.target.value)}
        />
        <label htmlFor="itemBody">
          Description (enter your contact details, as well):
        </label>
        <DefaultEditor
          value={html}
          className="form-control"
          onChange={onChange}
        />
        <br />
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
        <button
          type="submit"
          onClick={(e) => {
            handleEdit(e);
          }}
          className="btn btn-primary btn-lg w-100"
        >
          Submit
        </button>
      </form>
    </main>
  );
};
export default UpdateItem;
