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

  savePost: thunk(async (actions, data, helpers) => {
    const form_data = data.item;
    const cb = data.cb;

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
          cb(response.data.item_id);
        }
      })
      .catch((error) => {
        console.log(error);
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
      actions.setBrand('');
      actions.setPrice('');
      actions.setModel('');
      actions.setEntry('');
      actions.setImage1('');
      actions.setImage2('');
      actions.setImage3('');
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  }),

  editItem: thunk(async (actions, updatedItem, helpers) => {
    console.log(updatedItem);
    const form_data = updatedItem.item;
    const id = updatedItem.id;
    const cb = updatedItem.cb;

    const config = {
      headers: {
        'Content-Type': 'x-www-form-urlencoded',
        access_token: `${localStorage.getItem('access_token')}`,
      },
    };

    for (const entry of form_data.entries()) {
      console.log(entry);
    }

    axios
      .put(`http://localhost:8000/items/single/update/${id}`, form_data, config)
      .then((response) => {
        console.log(response);
        cb();
      })
      .catch((error) => {
        console.log(error);
      });

    // axios({
    //   method: 'put',
    //   url: `http://localhost:8000/items/single/update/${id}`,
    //   data: form_data,
    //   headers: {
    //     'Content-Type': 'x-www-form-urlencoded',
    //     access_token: `Bearer ${localStorage.getItem('access_token')}`,
    //   },
    // })
    //   .then((response) => {
    //     console.log(response);
    //     cb();
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }),

  // editItem: thunk(async (actions, updatedItem, helpers) => {
  //   const { items } = helpers.getState();

  //   const slug = updatedItem.slug;
  //   const form_data = updatedItem.form_data;
  //   const cb = updatedItem.cb;

  //   try {
  //     axios
  //       .put(`${dest}/items/${slug}/`, form_data, {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //           access: `Bearer ${localStorage.getItem('access')}`,
  //           refresh: `Bearer ${localStorage.getItem('refresh')}`,
  //         },
  //       })
  //       .then((response) => {
  //         if (response.data['error'])
  //           return cb(response.data['error'], null, null);
  //         if (
  //           !response.data['error'] &&
  //           (response.data.item_image1?.length > 0 ||
  //             response.data.item_image2?.length > 0 ||
  //             response.data.item_image3?.length > 0)
  //         ) {
  //           return cb(null, response.data, null);
  //         } else {
  //           actions.setItems([...items, response.data]);
  //           actions.setItems(
  //             items.map((item) =>
  //               item.slug === slug ? { ...response.data } : item
  //             )
  //           );

  //           actions.setSlug('');
  //           actions.setBrand('');
  //           actions.setPrice('');
  //           actions.setModel('');
  //           actions.setEntry('');
  //           actions.Image1(null);
  //           actions.Image2(null);
  //           actions.Image3(null);

  //           return cb(null, null);
  //         }
  //       })
  //       // .then((data) => {
  //       //   console.log('data', data);
  //       // })
  //       .catch((error) => {
  //         cb(null, error.response.data, error.response.status);
  //       });
  //   } catch (err) {
  //     console.log(`Error: ${err}`);
  //   }
  // }),
});
