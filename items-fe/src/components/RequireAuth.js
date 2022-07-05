import NewItem from './NewItem';
import Profile from './Profile';
import EditItem from './EditItem';
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
      <Route
        path="/edit/:slug"
        element={
          <Auth redirectTo="/login">
            <EditItem />
          </Auth>
        }
      />
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
