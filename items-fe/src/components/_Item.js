
import { Link } from 'react-router-dom';
import { formatDistance, parseISO } from 'date-fns';
import { DefaultEditor } from 'react-simple-wysiwyg';

const Item = ({ item }) => {
  // let dt = format(parseISO(item.createdAt), 'MMMM dd, yyyy pp');
  let dt = formatDistance(new Date(), parseISO(item.createdAt));

  return (
    <article className="item">
      <Link to={`items/${item.slug}/`} className="item-link">
        <div className="h4 text-dark">
          {item.brand} &nbsp;
          {item.model}
        </div>
      </Link>
      <div className="h5 text-dark">CAD$ {item.price}</div>
      <div class="wysiwyg-home">
        <DefaultEditor
          value={
            item.entry?.length < 25
              ? item.entry
              : `${item.entry?.slice(0, 25)} ...`
          }
          contentEditable="false"
          className="form-control"
        />
        <span className="spanImage">
              <img
                src={item?.item_image1}
                alt="1"
                className={
                  !!item.item_image1 === false
                    ? 'itemImageonError'
                    : 'mainPageImage'
                }
              />
        </span>
      </div>
      <p className="postDate">...{dt}</p>
    </article>
  );
 }
export default Item;
