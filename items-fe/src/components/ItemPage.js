import { useParams, useNavigate } from 'react-router-dom';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { useState, useEffect, useRef } from 'react';
import { ITEM_ID } from '../constants';
import axios from 'axios';
import { DefaultEditor } from 'react-simple-wysiwyg';

const ItemPage = () => {
  const OBJECT_ACCESS_INDEX = 0;
  const { id } = useParams();
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const deleteItem = useStoreActions((actions) => actions.deleteItem);
  const getUserById = useStoreState((state) => state.getUserById);

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

  const user = getUserById(id)[OBJECT_ACCESS_INDEX];

  console.log('user ', user);
  const savePost = useStoreActions((actions) => actions.savePost);

  const handleSubmit = (e) => {
    e.preventDefault();

    let item = new FormData(e.form);
    if (imageUpload1) item.append('item_image1a', imageUpload1);
    if (imageUpload1) item.append('item_image1b', imageUpload1);
    if (imageUpload2) item.append('item_image2a', imageUpload2);
    if (imageUpload2) item.append('item_image2b', imageUpload2);
    if (imageUpload3) item.append('item_image3a', imageUpload3);
    if (imageUpload3) item.append('item_image3b', imageUpload3);
    item.append('brand', brand);
    item.append('price', price);
    item.append('description', html);
    item.append('location', location);
    item.append('model', model);

    savePost({
      item: item,
      cb: (id) => {
        navigate('/items/' + id);
      },
    });
  };

  const handleDelete = (id) => {
    let confirmation = window.confirm('Are you sure for deleting the item?');
    if (confirmation) {
      deleteItem({ id: id, username: user.username });
      navigate('/');
    }
  };

  useEffect(() => {
    axios
      .get(ITEM_ID + '/' + id)
      .then((response) => {
        console.log(response);
        setBrand(response.data.brand);
        setModel(response.data.model);
        setPrice(response.data.price);
        setLocation(response.data.location);
        setHtml(response.data.description);
        setImage1(response.data.image[0]['item_image1']);
        setImage2(response.data.image[0]['item_image2']);
        setImage3(response.data.image[0]['item_image3']);
        console.log('image1 ', response.data.image[0]['item_image1']);
      })
      .catch((error) => console.log(error));
  }, [id, image1]);

  const scrollTo = (ref) => {
    if (ref && ref.current /* + other conditions */) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  function onChange(e) {
    setHtml(e.target.value);
  }

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
          {/* <textarea
            type="text"
            id="itemBody"
            className="form-control"
            required
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
          /> */}
          <div>
            <br />
            {/* 
                  // URL.createObjectURL(imageUpload1) ||
                  static/images/guney51/1.jpeg
            
            */}
            {image1 && (
              <img
                className="itemImage"
                src="static/images/guney51/1.jpeg"
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
            {imageUpload2 && (
              <img
                className="itemImage"
                id="newImage2"
                src={URL.createObjectURL(imageUpload2)}
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
            {imageUpload3 && (
              <img
                className="itemImage"
                id="newImage3"
                src={URL.createObjectURL(imageUpload3)}
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
  );
};

export default ItemPage;
