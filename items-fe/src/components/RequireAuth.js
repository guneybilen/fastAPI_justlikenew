import NewItem from './NewItem';
import Profile from './Profile';
import UpdateItem from './UpdateItem';
import usePostRefreshTokenAxios from '../hooks/usePostRefreshTokenAxios';
import { Routes, Route, Navigate } from 'react-router-dom';

function RequireAuth() {
  usePostRefreshTokenAxios();

  return (
    <Routes>
      <Route
        path="/item"
        element={
          <Auth redirectTo="/login">
            <NewItem />
          </Auth>
        }
      />
      {/* <Route
        path="/update/:id"
        element={
          <Auth redirectTo="/login">
            <UpdateItem />
          </Auth>
        }
      /> */}
      {/* <Route
        path="/update/:id"
        element={
          <Auth redirectTo="/login">
            <UpdateItem />
          </Auth>
        } YOU NEED TO USE THIS ONE WHEN THE  EDITITEM.JS COMPONENT IMPLEMENTING COMPLETE!
      /> */}
      <Route
        path="/profile"
        element={
          <Auth redirectTo="/login">
            <Profile />
          </Auth>
        }
      />
    </Routes>
  );
}

export default RequireAuth;

function Auth({ children, redirectTo }) {
  let refresh;
  try {
    refresh = localStorage.getItem('refresh');
  } catch (e) {
    refresh = false;
  }

  return !!refresh ? children : <Navigate to={redirectTo} />;
}
