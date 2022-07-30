import { useParams, useNavigate } from 'react-router-dom';
import { useStoreActions } from 'easy-peasy';
import React, { useState, useEffect, useRef } from 'react';
import { ITEM_ID } from '../constants';
import axios from 'axios';
import { DefaultEditor } from 'react-simple-wysiwyg';

const ItemPage = () => {
  // const OBJECT_ACCESS_INDEX = 0;
  const { id } = useParams();
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  // const deleteItem = useStoreActions((actions) => actions.deleteItem);
  // const getUserById = useStoreState((state) => state.getUserById);

  const [username, setUsername] = useState('');
  const [itemId, setItemId] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [image3, setImage3] = useState('');
  const [imageUpload1, setImageUpload1] = useState(null);
  const [imageUpload2, setImageUpload2] = useState(null);
  const [imageUpload3, setImageUpload3] = useState(null);
  const [error, setError] = useState('');
  const [closeButtonShouldShow, setCloseButtonShouldShow] = useState(false);
  const [html, setHtml] = useState('');

  // const user = getUserById(id)[OBJECT_ACCESS_INDEX];

  const editItem = useStoreActions((actions) => actions.editItem);

  const handleSubmit = (e) => {
    e.preventDefault();

    let item = new FormData(e.form);
    if (imageUpload1) item.append('item_image1a', imageUpload1);
    if (imageUpload1) item.append('item_image1b', imageUpload1);
    if (imageUpload2) item.append('item_image2a', imageUpload2);
    if (imageUpload2) item.append('item_image2b', imageUpload2);
    if (imageUpload3) item.append('item_image3a', imageUpload3);
    if (imageUpload3) item.append('item_image3b', imageUpload3);
    item.append('brand', JSON.stringify(brand));
    item.append('price', JSON.stringify(price));
    item.append('description', JSON.stringify(html));
    item.append('location', JSON.stringify(location));
    item.append('model', JSON.stringify(model));

    editItem({
      item: item,
      id: itemId,
      cb: () => {
        navigate('/');
      },
    });
  };

  // const handleDelete = (id) => {
  //   let confirmation = window.confirm('Are you sure for deleting the item?');
  //   if (confirmation) {
  //     deleteItem({ id: id, username: user.username });
  //     navigate('/');
  //   }
  // };

  useEffect(() => {
    axios
      .get(ITEM_ID + '/' + id, {
        headers: {
          access_token: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setUsername(response.data.username);
        setItemId(response.data['item'][0]['id']);
        setBrand(response.data['item'][0]['brand']);
        setLocation(response.data['item'][0]['location']);
        setHtml(response.data['item'][0]['description']);
        setPrice(response.data['item'][0]['price']);
        setModel(response.data['item'][0]['model']);
        setImage1(response.data['item'][0]['image'][0]['item_image1']);
        setImage2(response.data['item'][0]['image'][0]['item_image2']);
        setImage3(response.data['item'][0]['image'][0]['item_image3']);
      })
      .catch((error) => console.log(error));
  }, [id]);

  // const scrollTo = (ref) => {
  //   if (ref && ref.current /* + other conditions */) {
  //     ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  //   }
  // };

  function onChange(e) {
    setHtml(e.target.value);
  }

  const displayNone = (e) => {
    e.preventDefault();
    setCloseButtonShouldShow(false);
  };

  return (
    <>
      <main className="NewPost">
        {error && closeButtonShouldShow && (
          <div className="alert text-center" id="id001" ref={scrollRef}>
            <span className="closebtn" onClick={(e) => displayNone(e)}>
              &times;
            </span>
            <strong>{error}</strong>
          </div>
        )}
        <>
          <form action="" className="newPostForm" encType="multipart/form-data">
            <label htmlFor="itemBrand">Brand:</label>
            <input
              type="text"
              id="itemBrand"
              className="form-control"
              required
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
            <label htmlFor="itemModel">Model:</label>
            <input
              type="text"
              id="itemModel"
              required
              className="form-control"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
            <label htmlFor="itemModel">Location:</label>
            <input
              type="text"
              id="itemLocation"
              required
              className="form-control"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <label htmlFor="itemPrice">CAD$ Price:</label>
            <input
              type="text"
              id="itemPrice"
              className="form-control"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <label htmlFor="itemBody">
              Entry (enter your non-private contact details also, so buyers can
              reach you!):
            </label>
            <DefaultEditor
              value={html}
              placeholder="You can start typing here..."
              className="form-control"
              onChange={onChange}
            />
            <div>
              <br />
              {image1 && !imageUpload1 && (
                <img
                  className="itemImage"
                  src={`pictures/images/${username}${itemId}/${image1}`}
                  id="newImage1"
                  alt="newImage1"
                  width="150px"
                  height="75px"
                />
              )}
              {imageUpload1 && (
                <img
                  className="itemImage"
                  src={URL.createObjectURL(imageUpload1)}
                  id="newImage1"
                  alt="newImage1"
                  width="150px"
                  height="75px"
                />
              )}
              <span className="spanImage"></span>

              {(imageUpload1 || image1) && (
                <input
                  type="button"
                  value="delete image1"
                  className="btn btn-sm btn-danger"
                  onClick={() => {
                    setImage1(false);
                    setImageUpload1(false);
                  }}
                />
              )}

              <br />
            </div>
            <div>
              <label htmlFor="image1">
                {image1 ? 'change image1' : 'add image 1'} &nbsp;
              </label>
              <input
                type="file"
                alt="item"
                name="image"
                accept="image/*"
                onChange={(e) => {
                  e.target.files[0] === undefined ||
                    setImageUpload1(e.target.files[0]);
                }}
              />
            </div>
            <br />
            <div>
              {image2 && !imageUpload2 && (
                <img
                  className="itemImage"
                  src={`pictures/images/${username}${itemId}/${image2}`}
                  id="newImage2"
                  alt="newImage2"
                  width="150px"
                  height="75px"
                />
              )}
              {imageUpload2 && (
                <img
                  className="itemImage"
                  src={URL.createObjectURL(imageUpload2)}
                  id="newImage2"
                  alt="newImage2"
                  width="150px"
                  height="75px"
                />
              )}
              <span className="spanImage">
                {(imageUpload2 || image2) && (
                  <input
                    type="button"
                    value="delete image2"
                    className="btn btn-sm btn-danger"
                    onClick={() => {
                      setImage2(false);
                      setImageUpload2(false);
                    }}
                  />
                )}
              </span>
              <br />
              <label htmlFor="image2">
                {image2 ? 'change image2' : 'add image 2'} &nbsp;
              </label>
              <input
                type="file"
                id="image2"
                alt="item"
                name="image"
                accept="image/*"
                onChange={(e) => {
                  e.target.files[0] === undefined ||
                    setImageUpload2(e.target.files[0]);
                }}
              />
            </div>
            <br />
            <div>
              {image3 && !imageUpload3 && (
                <img
                  className="itemImage"
                  src={`pictures/images/${username}${itemId}/${image3}`}
                  id="newImage3"
                  alt="newImage3"
                  width="150px"
                  height="75px"
                />
              )}
              {imageUpload3 && (
                <img
                  className="itemImage"
                  src={URL.createObjectURL(imageUpload3)}
                  id="newImage3"
                  alt="newImage3"
                  width="150px"
                  height="75px"
                />
              )}
              <span className="spanImage">
                {(imageUpload3 || image3) && (
                  <input
                    type="button"
                    value="delete image3"
                    className="btn btn-sm btn-danger"
                    onClick={() => {
                      setImage3(false);
                      setImageUpload3(false);
                    }}
                  />
                )}
              </span>
              <br />
              <label htmlFor="image3">
                {image3 ? 'change image3' : 'add image 3'} &nbsp;
              </label>
              <input
                type="file"
                id="image3"
                alt="item"
                name="image"
                accept="image/*"
                onChange={(e) => {
                  e.target.files[0] === undefined ||
                    setImageUpload3(e.target.files[0]);
                }}
              />
            </div>
            <br />
            <button
              type="submit"
              onClick={(e) => {
                handleSubmit(e);
              }}
              className="btn btn-primary btn-lg w-100"
            >
              Submit
            </button>
          </form>
        </>
      </main>
    </>
  );
};

export default ItemPage;
