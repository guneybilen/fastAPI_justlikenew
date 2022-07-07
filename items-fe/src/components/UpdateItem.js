import React, { useEffect, useCallback } from 'react';
import { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { DefaultEditor } from 'react-simple-wysiwyg';
import { IMAGES_URL } from '../constants';
import Uploady from '@rpldy/uploady';
import UploadPreview from '@rpldy/upload-preview';
import { asUploadButton } from '@rpldy/upload-button';
import styled from 'styled-components';
import { useItemProgressListener } from '@rpldy/uploady';

import {
  getItemBrandForSingleUser,
  getItemModelForSingleUser,
  getItemPriceForSingleUser,
  getItemDescriptionForSingleUser,
  getItemCreatedDateForSingleUser,
  getUserUserNameWithImages,
} from '../helpers/helperFunctions';
import { bg } from 'date-fns/locale';

const filterBySize = (file) => {
  //filter out images larger than 5MB
  return file.size <= 5242880;
};

const DivUploadButton = asUploadButton((props) => {
  return (
    <div {...props} style={{ cursor: 'pointer' }} className="btn-primary">
      Upload Image Button (One at a time...)
    </div>
  );
});

const brandInputElement = (getUserLocal, setBrand) => {
  return (
    <input
      type="text"
      id="itemBrand"
      required
      value={getItemBrandForSingleUser(getUserLocal)}
      onChange={(e) => setBrand(e.target.value)}
    />
  );
};

const getItemModelForSingleUserInput = (getUserLocal, setModel) => {
  return (
    <input
      type="text"
      id="itemBrand"
      required
      value={getItemModelForSingleUser(getUserLocal)}
      onChange={(e) => setModel(e.target.value)}
    />
  );
};

const getItemPriceForSingleUserInput = (getUserLocal, setPrice) => {
  return (
    <input
      type="text"
      id="itemBrand"
      required
      value={getItemPriceForSingleUser(getUserLocal)}
      onChange={(e) => setPrice(e.target.value)}
    />
  );
};

const getUserNameWithImagesImageTag = (
  getUserLocal,
  imageNumber,
  OBJECT_ACCESS_INDEX
) => {
  return (
    <img
      src={
        IMAGES_URL +
        getUserUserNameWithImages(getUserLocal)[OBJECT_ACCESS_INDEX][
          'singleUserUserName'
        ] +
        '1/' +
        getUserUserNameWithImages(getUserLocal)[OBJECT_ACCESS_INDEX][
          `singleImage${imageNumber}`
        ]
      }
      alt="1"
      height="100"
      width="100"
    />
  );
};

const Content = styled.div`
  border: 1px solid #000;
  background-image: url(${(props) =>
    props.imgObj ? props.imgObj.url : props.bg.url})
  width: 50px;
  height: 50px;
`;

const PreviewImage = styled.img`
  margin: 5px;
  max-width: 200px;
  height: auto;
  transition: opacity 0.4s;
  ${({ completed }) => `opacity: ${completed / 100};`}
`;

const CustomImagePreview = ({ id, url }) => {
  const [completed, setCompleted] = useState(0);

  useItemProgressListener((item) => {
    if (item.id === id) {
      setCompleted(item.completed);
    }
  });

  return <PreviewImage src={url} completed={completed} />;
};

const UpdateItem = () => {
  const getPreviewProps = useCallback((item) => ({ id: item.id }), []);

  const OBJECT_ACCESS_INDEX = 0;
  const ARRAY_ACCESS_INDEX = 0;
  const { id } = useParams();
  const getUserById = useStoreState((state) => state.getUserById);

  const userLocal = getUserById(id)[OBJECT_ACCESS_INDEX];

  const scrollRef = useRef(null);

  const formEl = useRef(null);

  const [error, setError] = useState('');
  const [closeButtonShouldShow, setCloseButtonShouldShow] = useState(false);

  const [dt, setDt] = useState('');

  const [brand, setBrand] = useState('');
  const [getUserLocal, setUserLocal] = useState('');
  const [model, setModel] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  const forSettingDescription = getUserLocal
    ? getItemDescriptionForSingleUser(getUserLocal)
    : '';

  const [html, setHtml] = useState('');

  const scrollTo = (ref) => {
    if (ref && ref.current /* + other conditions */) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    setUserLocal(userLocal);
  }, [getUserLocal, userLocal]);

  useEffect(() => {
    if (getUserLocal)
      setHtml(
        getItemDescriptionForSingleUser(getUserLocal)[ARRAY_ACCESS_INDEX]
      );
    else setHtml('');
  }, [getUserLocal]);

  function onChange(e) {
    setHtml(e.target.value);
  }

  const handleEdit = (e) => {
    e.preventDefault();

    let form_data = new FormData();

    form_data.append('brand', brand);
    form_data.append('price', price);
    form_data.append('entry', html);
    form_data.append('model', model);

    form_data.append('seller', localStorage.getItem('seller'));
    form_data.append('nickname', localStorage.getItem('nickname'));
  };
  const displayNone = (e) => {
    e.preventDefault();
    setCloseButtonShouldShow(false);
  };

  const [getImageChangeState, setImageChangeState] = useState({});

  const handleChangeImage = (e) => {
    setImageChangeState(URL.createObjectURL(e.target.files[0]));
    // <CustomImagePreview url={getImageChangeState[e.target.name]} />;
  };

  const u = 'bg.jpeg';

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
      <form
        action=""
        className="newPostForm"
        ref={formEl}
        encType="multipart/form-data"
      >
        <label htmlFor="itemBrand">Brand:</label>
        {getUserLocal ? brandInputElement(getUserLocal, setBrand) : ''}
        <label htmlFor="itemModel">Model:</label>
        {getUserLocal
          ? getItemModelForSingleUserInput(getUserLocal, setModel)
          : ''}
        <label htmlFor="itemPrice">CAD$ Price:</label>
        {getUserLocal
          ? getItemPriceForSingleUserInput(getUserLocal, setPrice)
          : ''}
        <label htmlFor="itemBody">
          Description (enter your contact details, as well):
        </label>
        <DefaultEditor
          value={html}
          className="form-control"
          onChange={onChange}
        />
        <br />
        <br />
        <div className="" style={{ float: 'center' }}>
          {getUserLocal
            ? getUserNameWithImagesImageTag(
                getUserLocal,
                1,
                OBJECT_ACCESS_INDEX
              )
            : ''}
          {getUserLocal
            ? getUserNameWithImagesImageTag(
                getUserLocal,
                2,
                OBJECT_ACCESS_INDEX
              )
            : ''}
          {getUserLocal
            ? getUserNameWithImagesImageTag(
                getUserLocal,
                2,
                OBJECT_ACCESS_INDEX
              )
            : ''}
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
        </div>
      </form>
      <input
        type="file"
        id="img"
        name="img"
        accept="image/*"
        className="w-100"
        onChange={handleChangeImage}
      />
      {/* {console.log(Object.keys(getImageChangeState).length === 0)} */}

      {Object.keys(getImageChangeState).length === 0 ? (
        <img src={u} alt="1"></img>
      ) : (
        <PreviewImage src={getImageChangeState} alt="1"></PreviewImage>
      )}

      <Uploady
        destination={{ url: 'my-server.com/upload' }}
        fileFilter={filterBySize}
        accept="image/*"
        multiple={false}
      >
        <DivUploadButton />
        <div>
          <br />
          <UploadPreview
            previewComponentProps={getPreviewProps}
            PreviewComponent={CustomImagePreview}
          />
        </div>
      </Uploady>
    </main>
  );
};

export default UpdateItem;
