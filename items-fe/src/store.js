import axios from 'axios';
import { createStore, action, thunk, computed } from 'easy-peasy';

axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
axios.defaults.xsrfCookieName = 'csrftoken';

let dest = '';

export default createStore({
  // sellerNickname: '',
  // setSellerNickname: action((state, payload) => {
  //   state.sellerNickname = payload;
  // }),

  users: [],
  setUsers: action((state, payload) => {
    console.log(payload);
    state.users = payload;
  }),

  // slug: '',
  // setSlug: action((state, payload) => {
  //   state.slug = payload;
  // }),

  // brand: '',
  // setBrand: action((state, payload) => {
  //   state.brand = payload;
  // }),

  // model: '',
  // setModel: action((state, payload) => {
  //   state.model = payload;
  // }),

  // price: 0,
  // setPrice: action((state, payload) => {
  //   state.price = payload;
  // }),

  // entry: '',
  // setEntry: action((state, payload) => {
  //   state.entry = payload;
  // }),

  // createdAt: '',
  // setCreatedAt: action((state, payload) => {
  //   state.createdAt = payload;
  // }),

  // seller: '',
  // setSeller: action((state, payload) => {
  //   state.seller = payload;
  // }),

  // image1: '',
  // setImage1: action((state, payload) => {
  //   state.image1 = payload;
  // }),

  // image2: '',
  // setImage2: action((state, payload) => {
  //   state.image2 = payload;
  // }),

  // image3: '',
  // setImage3: action((state, payload) => {
  //   state.image3 = payload;
  // }),

  search: '',
  setSearch: action((state, payload) => {
    state.search = payload;
  }),
  searchResults: [],
  setSearchResults: action((state, payload) => {
    state.searchResults = payload;
  }),

  itemCount: computed((state) =>
    state.items?.length > 0 ? state.items.length : 0
  ),

  getUsers: action((state, payload) => {
    return state.users;
  }),

  getUserById: computed((state, payload) => {
    return (payload) => {
      return state.users.map((u) => {
        console.log('state ' + state);
        if (parseInt(u.id) === parseInt(payload)) {
          return u;
        } else return false;
      });
    };
  }),

  saveItem: thunk(async (actions, data, helpers) => {
    const form_data = data.item;
    const cb = data.cb;
    const err = data.err;

    axios({
      method: 'post',
      url: 'http://localhost:8000/items/create-item/',
      data: form_data,
      headers: {
        'Content-Type': 'x-www-form-urlencoded',
        access_token: `${localStorage.getItem('access_token')}`,
      },
    })
      .then((response) => {
        if (response.data['access_token'] === 'access_token_error')
          window.location = '/';
        if (response.data.result === true) {
          cb(response.data.user_id, response.data.item_id);
        }
      })
      .catch((error) => {
        console.log(error);
        err(error);
      });
  }),

  deleteItem: thunk(async (actions, info, helpers) => {
    const { items } = helpers.getState();
    const { slug, nickname } = info;

    try {
      await axios.delete(
        `${dest}/items/${slug}`,
        { data: { nickname: nickname } },
        {
          headers: {
            'Content-Type': 'application/json',
            accept: 'application/json',
            access: `Bearer ${localStorage.getItem('access')}`,
            refresh: `Bearer ${localStorage.getItem('refresh')}`,
          },
        }
      );
      actions.setItems(items.filter((items) => items.slug !== slug));
      // actions.setBrand('');
      // actions.setPrice('');
      // actions.setModel('');
      // actions.setEntry('');
      // actions.setImage1('');
      // actions.setImage2('');
      // actions.setImage3('');
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  }),

  editItem: thunk(async (actions, updatedItem, helpers) => {
    const form_data = updatedItem.item;
    const particular_item_id = updatedItem.particular_item_id;
    const cb = updatedItem.cb;
    const err = updatedItem.err;

    const config = {
      headers: {
        'Content-Type': 'x-www-form-urlencoded',
        access_token: `${localStorage.getItem('access_token')}`,
      },
    };

    axios
      .patch(
        `http://localhost:8000/items/single/update/${particular_item_id}`,
        form_data,
        config
      )
      .then((response) => {
        console.log(response);
        cb();
      })
      .catch((error) => {
        console.log(error);
        err(error);
      });
  }),

  editImage: thunk(async (actions, updatedImage, helpers) => {
    const form_data = updatedImage.item;
    const particular_item_id = updatedImage.particular_item_id;
    const cb = updatedImage.cb;
    const err = updatedImage.err;
    const image1ExtraData = updatedImage.image1ExtraData;
    const image2ExtraData = updatedImage.image2ExtraData;
    const image3ExtraData = updatedImage.image3ExtraData;

    const config = {
      headers: {
        'Content-Type': 'x-www-form-urlencoded',
        access_token: `${localStorage.getItem('access_token')}`,
        image1ExtraData: image1ExtraData,
        image2ExtraData: image2ExtraData,
        image3ExtraData: image3ExtraData,
      },
    };

    axios
      .patch(
        `http://localhost:8000/image/single/update/${particular_item_id}`,
        form_data,
        config
      )
      .then((response) => {
        console.log(response);
        cb(particular_item_id);
      })
      .catch((error) => {
        console.log(error);
        err(error);
      });
  }),
  updateUser: thunk(async (actions, updatedUser, helpers) => {
    const form_data = updatedUser.item;
    // const cb = updatedUser.cb;
    const err = updatedUser.err;

    axios({
      method: 'patch',
      url: `http://localhost:8000/users/update_user/`,
      data: { body: form_data },
      headers: {
        'Content-Type': 'x-www-form-urlencoded',
        access_token: `${localStorage.getItem('access_token')}`,
      },
    })
      .then((response) => {
        console.log(response);
        // cb(particular_item_id);
      })
      .catch((error) => {
        console.log(error);
        err(error);
      });
  }),
});
