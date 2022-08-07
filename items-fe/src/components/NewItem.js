import { useStoreActions } from 'easy-peasy';
import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { DefaultEditor } from 'react-simple-wysiwyg';

const NewItem = () => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [closeButtonShouldShow, setCloseButtonShouldShow] = useState(false);
  const [html, setHtml] = useState('');

  // const scrollTo = (ref) => {
  //   if (ref && ref.current /* + other conditions */) {
  //     ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  //   }
  // };

  const saveItem = useStoreActions((actions) => actions.saveItem);

  const handleSubmit = (e) => {
    e.preventDefault();

    let item = new FormData(e.form);
    item.append('brand', brand);
    item.append('price', price);
    item.append('description', html);
    item.append('location', location);
    item.append('model', model);

    saveItem({
      item: item,
      cb: (user_id, particular_item_id) => {
        navigate(`/edit_image/${user_id}/item/${particular_item_id}`);
      },
      err: (error) => {
        setError(error);
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
          <label htmlFor="itemModel">Location:</label>
          <input
            type="text"
            id="itemLocation"
            required
            className="form-control"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <label htmlFor="itemPrice">C$ Price:</label>
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

export default NewItem;
