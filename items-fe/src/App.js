import Header from './components/Header';
import Nav from './components/Nav';
import Footer from './components/Footer';
import About from './components/About';
import Home from './components/Home';
import UpdateItem from './components/UpdateItem';
import NewItem from './components/NewItem';
import Login from './auth/Login';
import Signup from './auth/Signup';
import Error from './auth/Error';
import PreSignup from './auth/PreSignup';
import NewPassword from './auth/NewPassword';
import ForgotPassword from './auth/ForgotPassword';
import Activation from './auth/Activation';
import ItemPage from './components/ItemPage';
import { useStoreActions } from 'easy-peasy';
import { useEffect } from 'react';
import useAxiosFetch from './hooks/useAxiosFetch';
import RequireAuth from './components/RequireAuth';
import { Routes, Route } from 'react-router-dom';
import { ITEMS_ALL } from './constants';

// for api variable see /etc/nginx/sites-enabled
// let url = '/';

function App() {
  const setUsers = useStoreActions((actions) => actions.setUsers);
  const { data } = useAxiosFetch(ITEMS_ALL);

  useEffect(() => {
    setUsers(data);
    console.log('data ' + data);
  }, [data, setUsers]);

  return (
    <div className="App">
      <Header title="electronics guru" />
      <Nav />

      <Routes>
        <Route forceRefresh={true} path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/activation/:token" element={<Activation />} />
        <Route path="/about" element={<About />} />
        <Route path="/error" element={<Error />} />
        <Route path="/presignup" element={<PreSignup />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/newpassword/:id" element={<NewPassword />} />
        <Route
          path="/item"
          element={
            <RequireAuth>
              <NewItem />
            </RequireAuth>
          }
        ></Route>
        <Route
          path="items/:id"
          element={
            <RequireAuth>
              <ItemPage />
            </RequireAuth>
          }
        ></Route>
        <Route
          path="/update/:id"
          element={
            <RequireAuth>
              <UpdateItem />
            </RequireAuth>
          }
        ></Route>
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
