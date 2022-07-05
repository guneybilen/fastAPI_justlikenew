import { useStoreActions } from 'easy-peasy';
import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { DefaultEditor } from 'react-simple-wysiwyg';

const NewPost = () => {
  const history = useNavigate();
  const scrollRef = useRef(null);

  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  // const [entry, setEntry] = useState('');
  const [price, setPrice] = useState('');
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [imageUpload1, setImageUpload1] = useState(null);
  const [imageUpload2, setImageUpload2] = useState(null);
  const [imageUpload3, setImageUpload3] = useState(null);
  const [error, setError] = useState('');
  const [closeButtonShouldShow, setCloseButtonShouldShow] = useState(false);
  const [html, setHtml] = useState('You can start typing here...');

  const scrollTo = (ref) => {
    if (ref && ref.current /* + other conditions */) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const savePost = useStoreActions((actions) => actions.savePost);

  const handleSubmit = (e) => {
    e.preventDefault();

    let form_data = new FormData();
    if (imageUpload1) form_data.append('item_image1', imageUpload1);
    if (imageUpload2) form_data.append('item_image2', imageUpload2);
    if (imageUpload3) form_data.append('item_image3', imageUpload3);
    form_data.append('brand', brand);
    form_data.append('price', price);
    form_data.append('entry', html);
    form_data.append('model', model);
    form_data.append('seller', localStorage.getItem('loggedInId'));

    savePost({
      form_data: form_data,
      cb: (brandormodelerror, error, status) => {
        let error_sentence = null;
        if (brandormodelerror) {
          setError(brandormodelerror);
          setCloseButtonShouldShow(true);
          scrollTo(scrollRef);
        } else {
          error_sentence =
            status === 400 &&
            (error?.item_image1 ||
              error?.item_image2 ||
              error?.item_image3 ||
              error?.price);
          setError(error_sentence);
          setCloseButtonShouldShow(true);
          scrollTo(scrollRef);
        }

        if (!brandormodelerror && !error_sentence) history('/');
      },
    });
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
          <label htmlFor="itemPrice">CAD$ Price:</label>
          <input
            type="text"
            id="itemPrice"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <label htmlFor="itemBody">
            Entry (enter your non-private contact details also, so buyers can reach you!):
          </label>
          <DefaultEditor
            value={html}
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

export default NewPost;
