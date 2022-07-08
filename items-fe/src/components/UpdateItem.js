import React, { useEffect } from 'react';
import { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useStoreState } from 'easy-peasy';
import { DefaultEditor } from 'react-simple-wysiwyg';
import { ITEMS_URL } from '../constants';
import axios from 'axios';

import {
  getItemBrandForSingleUser,
  getItemModelForSingleUser,
  getItemPriceForSingleUser,
  getItemDescriptionForSingleUser,
  getItemCreatedDateForSingleUser,
  getItemIdForSingleUser,
  getSellerIdForSingleUser,
  getSellerNameForSingleUser,
} from '../helpers/helperFunctions';

const getItemModelForSingleUserInput = (getModel, setModel) => {
  return (
    <input
      type="text"
      id="itemBrand"
      required
      value={getModel}
      onChange={(e) => setModel(e.target.value)}
    />
  );
};

const getItemPriceForSingleUserInput = (getPrice, setPrice) => {
  return (
    <input
      type="text"
      id="itemBrand"
      required
      value={getPrice}
      onChange={(e) => setPrice(e.target.value)}
    />
  );
};

const brandInputElement = (getBrand, setBrand) => {
  return (
    <input
      type="text"
      id="itemBrand"
      required
      value={getBrand}
      onChange={(e) => setBrand(e.target.value)}
    />
  );
};

const UpdateItem = () => {
  const OBJECT_ACCESS_INDEX = 0;
  const ARRAY_ACCESS_INDEX = 0;
  const { id } = useParams();
  const getUserById = useStoreState((state) => state.getUserById);

  const userLocal = getUserById(id)[OBJECT_ACCESS_INDEX];

  const scrollRef = useRef(null);

  const formEl = useRef(null);

  const [error, setError] = useState('');

  const [closeButtonShouldShow, setCloseButtonShouldShow] = useState(false);

  let [getBrand, setBrand] = useState('');
  const [getUserLocal, setUserLocal] = useState('');
  const [getModel, setModel] = useState('');
  const [getPrice, setPrice] = useState('');
  const [getItemId, setItemId] = useState('');
  const [getURL, setURL] = useState('');

  const [getHtmlForWYSIWYGEditor, setHtmlForWYSIWYGEditor] = useState('');

  const [getSellerId, setSellerId] = useState(0);
  const [getSeller, setSeller] = useState('');

  useEffect(() => {
    setUserLocal(userLocal);
  }, [getUserLocal, userLocal]);

  useEffect(() => {
    if (getUserLocal) {
      setHtmlForWYSIWYGEditor(
        getItemDescriptionForSingleUser(getUserLocal)[ARRAY_ACCESS_INDEX]
      );
      setItemId(getItemIdForSingleUser(userLocal));
      setBrand(getItemBrandForSingleUser(getUserLocal));
      setURL(`update/${getUserLocal.id}`);
      setPrice(getItemPriceForSingleUser(getUserLocal));
      setModel(getItemModelForSingleUser(getUserLocal));
      setSellerId(getSellerIdForSingleUser(getUserLocal));
      setSeller(getSellerNameForSingleUser(getUserLocal));
    } else {
      setHtmlForWYSIWYGEditor('');
      setURL('');
      setPrice('');
      setModel('');
      setBrand('');
      setItemId('');
    }
  }, [getUserLocal, userLocal]);

  // console.log(getSellerId);

  function onChange(e) {
    setHtmlForWYSIWYGEditor(e.target.value);
  }

  let form_data = new FormData();

  const handleEdit = (e) => {
    e.preventDefault();

    form_data.append('brand', getBrand);
    form_data.append('price', getPrice);
    form_data.append('description', getHtmlForWYSIWYGEditor);
    form_data.append('model', getModel);

    form_data.append('seller_Id', getSellerId);
    form_data.append('id', getItemId);
    form_data.append('seller', getSeller);

    axios({
      method: 'PUT',
      url: ITEMS_URL + getURL,
      data: form_data,
      'Content-Type': 'application/x-www-form-urlencoded',
      // access: `Bearer ${localStorage.getItem('access')}`,
      // refresh: `Bearer ${localStorage.getItem('refresh')}`,
    })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (response) {
        console.log(response);
      });
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
      <h5 className="">
        ...{getUserLocal ? getItemCreatedDateForSingleUser(getUserLocal) : ''}
      </h5>
      <form action="#" className="newPostForm" ref={formEl}>
        <label htmlFor="itemBrand">Brand:</label>
        {getUserLocal ? brandInputElement(getBrand, setBrand) : ''}
        <label htmlFor="itemModel">Model:</label>
        {getUserLocal ? getItemModelForSingleUserInput(getModel, setModel) : ''}
        <label htmlFor="itemPrice">CAD$ Price:</label>
        {getUserLocal ? getItemPriceForSingleUserInput(getPrice, setPrice) : ''}
        <label htmlFor="itemBody">
          Description (enter your contact details, as well):
        </label>
        <DefaultEditor
          value={getHtmlForWYSIWYGEditor}
          className="form-control"
          onChange={onChange}
        />
        <br />
        <br />
        <button
          type="submit"
          onClick={(e) => {
            handleEdit(e);
          }}
          className="btn btn-primary btn-lg w-100"
        >
          Submit
        </button>
        <br />
        <br />
      </form>
    </main>
  );
};

export default UpdateItem;
