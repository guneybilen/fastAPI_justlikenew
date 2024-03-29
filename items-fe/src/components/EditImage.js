import { useStoreActions } from 'easy-peasy';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { DefaultEditor } from 'react-simple-wysiwyg';
import { EDIT_ITEM_URL } from '../constants';
import axios from 'axios';

const EditImage = () => {
  const navigate = useNavigate();
  const { user_id } = useParams();
  const { particular_item_id } = useParams();
  // console.log('user_id ', user_id);
  const scrollRef = useRef(null);

  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [image1PresentCheck, setImage1PresentCheck] = useState(false);
  const [image2PresentCheck, setImage2PresentCheck] = useState(false);
  const [image3PresentCheck, setImage3PresentCheck] = useState(false);
  const [image1, setImage1] = useState('');
  const [image1ExtraData, setImage1ExtraData] = useState('');
  const [image2, setImage2] = useState('');
  const [image2ExtraData, setImage2ExtraData] = useState('');
  const [image3, setImage3] = useState('');
  const [image3ExtraData, setImage3ExtraData] = useState('');
  const [imageUpload1, setImageUpload1] = useState(null);
  const [imageUpload2, setImageUpload2] = useState(null);
  const [imageUpload3, setImageUpload3] = useState(null);
  const [error, setError] = useState('');
  const [closeButtonShouldShow, setCloseButtonShouldShow] = useState(false);
  const [html, setHtml] = useState('');
  const [data, setData] = useState([]);

  // const scrollTo = (ref) => {
  //   if (ref && ref.current /* + other conditions */) {
  //     ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  //   }
  // };

  // useEffect(() => {}, [particular_item_id]);

  useEffect(() => {
    axios
      .get(EDIT_ITEM_URL + user_id + '/particular_item/' + particular_item_id, {
        headers: {
          'Content-Type': 'application/json',
          access_token: localStorage.getItem('access_token'),
        },
      })
      .then((response) => {
        setData([response]);
        setBrand(response.data.brand);
        setModel(response.data.model);
        setPrice(response.data.price);
        setHtml(response.data.description);
        setLocation(response.data.location);
        setBrand(response.data.brand);
        setBrand(response.data.brand);
        response.data.image[0]?.item_image1 && setImage1PresentCheck(true);
        response.data.image[0]?.item_image2 && setImage2PresentCheck(true);
        response.data.image[0]?.item_image3 && setImage3PresentCheck(true);

        setImage1(
          `/static/images/${localStorage.getItem(
            'loggedin_username'
          )}${particular_item_id}/${response.data.image[0]?.item_image1}`
        );
        setImage2(
          `/static/images/${localStorage.getItem(
            'loggedin_username'
          )}${particular_item_id}/${response.data.image[0]?.item_image2}`
        );
        setImage3(
          `/static/images/${localStorage.getItem(
            'loggedin_username'
          )}${particular_item_id}/${response.data.image[0]?.item_image3}`
        );
      })
      .catch((error) => console.log(error));
  }, [user_id, particular_item_id]);

  const editImage = useStoreActions((actions) => actions.editImage);

  const handleSubmit = (e) => {
    e.preventDefault();

    let item = new FormData(e.form);
    if (imageUpload1) item.append('item_image1a', imageUpload1);
    if (imageUpload1) item.append('item_image1b', imageUpload1);
    if (imageUpload2) item.append('item_image2a', imageUpload2);
    if (imageUpload2) item.append('item_image2b', imageUpload2);
    if (imageUpload3) item.append('item_image3a', imageUpload3);
    if (imageUpload3) item.append('item_image3b', imageUpload3);

    editImage({
      item: item,
      particular_item_id: particular_item_id,
      image1ExtraData: image1ExtraData,
      image2ExtraData: image2ExtraData,
      image3ExtraData: image3ExtraData,
      cb: (id) => {
        navigate(`/items/${id}`);
      },
      err: (error) => {
        console.log(error);
        setError(error);
      },
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
      <>
        {data && (
          <form action="" className="newPostForm" encType="multipart/form-data">
            <label htmlFor="itemBrand">Brand:</label>
            {brand && (
              <input
                type="text"
                id="itemBrand"
                className="form-control"
                required
                value={brand}
                readOnly
              />
            )}
            <label htmlFor="itemModel">Model:</label>
            <input
              type="text"
              id="itemModel"
              required
              className="form-control"
              value={model}
              readOnly
            />
            <label htmlFor="itemModel">Location:</label>
            <input
              type="text"
              id="itemLocation"
              required
              className="form-control"
              value={location}
              readOnly
            />
            <label htmlFor="itemPrice">CAD$ Price:</label>
            <input
              type="text"
              id="itemPrice"
              className="form-control"
              value={price}
              readOnly
            />
            <label htmlFor="itemBody">
              Entry (enter your non-private contact details also, so buyers can
              reach you!):
            </label>
            <DefaultEditor
              value={html}
              placeholder="You can start typing here..."
              className="form-control"
              contentEditable={false}
            />
            <div>
              <br />
              {image1PresentCheck && (
                <img
                  className="itemImage"
                  src={image1}
                  id="newImage1"
                  alt="newImage1"
                  name="image1"
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
                  name="image1"
                  width="150px"
                  height="75px"
                />
              )}
            </div>
            <div>
              <span className="spanImage">
                {(imageUpload1 || image1) && (
                  <input
                    type="button"
                    value="delete image1"
                    className="btn btn-sm btn-danger"
                    onClick={() => {
                      setImage1(false);
                      setImageUpload1(false);
                      setImage1ExtraData(null);
                    }}
                  />
                )}
              </span>
              <label htmlFor="image1">
                {image1 ? 'change image1' : 'add image 1'} &nbsp;
              </label>
              <input
                type="file"
                alt="item"
                id="image1"
                accept="image/*"
                onChange={(e) => {
                  setImage1ExtraData(1);
                  e.target.files[0] === undefined ||
                    setImageUpload1(e.target.files[0]);
                }}
              />
            </div>
            <br />
            <div>
              {image2PresentCheck && (
                <img
                  className="itemImage"
                  src={image2}
                  id="newImage2"
                  alt="newImage2"
                  width="150px"
                  height="75px"
                />
              )}
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
              <br />

              <span className="spanImage">
                {(imageUpload2 || image2) && (
                  <input
                    type="button"
                    value="delete image2"
                    className="btn btn-sm btn-danger"
                    onClick={() => {
                      setImage2(false);
                      setImageUpload2(false);
                      setImage2ExtraData(null);
                    }}
                  />
                )}
              </span>
              <label htmlFor="image2">
                {image2 ? 'change image2' : 'add image 2'} &nbsp;
              </label>
              <input
                type="file"
                id="image2"
                alt="item"
                accept="image/*"
                onChange={(e) => {
                  setImage2ExtraData(2);
                  e.target.files[0] === undefined ||
                    setImageUpload2(e.target.files[0]);
                }}
              />
            </div>
            <br />
            <div>
              {image3PresentCheck && (
                <img
                  className="itemImage"
                  src={image3}
                  id="newImage3"
                  alt="newImage3"
                  width="150px"
                  height="75px"
                />
              )}
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
              <br />
              <span className="spanImage">
                {(imageUpload3 || image3) && (
                  <input
                    type="button"
                    value="delete image3"
                    className="btn btn-sm btn-danger"
                    onClick={() => {
                      setImage3(false);
                      setImageUpload3(false);
                      setImage3ExtraData(null);
                    }}
                  />
                )}
              </span>
              <label htmlFor="image3">
                {image3 ? 'change image3' : 'add image 3'} &nbsp;
              </label>
              <input
                type="file"
                id="image3"
                alt="item"
                accept="image/*"
                onChange={(e) => {
                  setImage3ExtraData(3);
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
        )}
      </>
    </main>
  );
};

export default EditImage;
