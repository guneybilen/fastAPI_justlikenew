import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { formatDistance, parseISO } from 'date-fns';
import { useState, useEffect } from 'react';
import { DefaultEditor } from 'react-simple-wysiwyg';

const ItemPage = () => {
  const { slug } = useParams();
  const history = useNavigate();
  const loggedInNickname = useStoreState((state) => state.loggedInNickname);
  const loggedInID = useStoreState((state) => state.loggedInID);
  const deleteItem = useStoreActions((actions) => actions.deleteItem);
  const getItemById = useStoreState((state) => state.getItemById);

  const item = getItemById(slug);
  if (item) {
    localStorage.setItem('seller', item.seller);
  }

  const [itemOwner, setItemOwner] = useState(false);

  // let dt = format(parseISO(item.createdAt), 'MMMM dd, yyyy pp');

  const handleDelete = (slug) => {
    let confirmation = window.confirm('Are you sure for deleting the item?');
    if (confirmation) {
      deleteItem({ slug: slug, nickname: item.get_seller_nickname });
      history('/');
    }
  };

  useEffect(() => {
    // console.log(item.get_seller_nickname);
    if (item && item.get_seller_nickname === localStorage.getItem('nickname'))
      setItemOwner(true);
  }, [item, loggedInNickname, loggedInID]);

  return (
    <main className="PostPage">
      <article className="post">
        {item && (
          <>
            <h3>{item?.brand}</h3>
            <p>{item?.model}</p>
            <p>CAD$ {item.price}</p>
            <DefaultEditor
              value={item?.entry}
              contentEditable="false"
              className="form-control wysiwyg"
            />
            <p className="itemDate">
              ...
              {item.createdAt &&
                formatDistance(new Date(), parseISO(item.createdAt), {
                  addSuffix: true,
                })}
            </p>

            <span className="spanImage">
              <img
                src={item?.item_image1}
                alt="1"
                className={
                  !!item.item_image1 === false
                    ? 'itemImageonError'
                    : 'itemImage'
                }
              />
            </span>
            <span className="spanImage">
              <img
                src={item?.item_image2}
                alt="2"
                className={
                  !!item.item_image2 === false
                    ? 'itemImageonError'
                    : 'itemImage'
                }
              />
            </span>

            <span className="spanImage">
              <img
                src={item.item_image3}
                alt="3"
                className={
                  !!item.item_image3 === false
                    ? 'itemImageonError'
                    : 'itemImage'
                }
              />
            </span>
            <br />
            <br />
            {itemOwner && (
              <div className="editdeletebuttons">
                <Link to={`/edit/${item.slug}`}>
                  <button className="editButton">Edit Item</button>
                </Link>
                <button
                  className="deleteButton"
                  onClick={() => handleDelete(item.slug)}
                >
                  Delete Item
                </button>
              </div>
            )}
          </>
        )}
      </article>
    </main>
  );
};

export default ItemPage;
