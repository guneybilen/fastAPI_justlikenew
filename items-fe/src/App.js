import Header from './components/Header';
import Nav from './components/Nav';
import Footer from './components/Footer';
import About from './components/About';
import Home from './components/Home';
import NewItem from './components/NewItem';
import EditItem from './components/EditItem';
import UserItems from './components/UserItems';
import ItemById from './components/ItemById';
import Profile from './components/Profile';
import ProfileConfirm from './components/ProfileConfirm';
import Login from './auth/Login';
import Signup from './auth/Signup';
import Error from './auth/Error';
import PreSignup from './auth/PreSignup';
import NewPassword from './auth/NewPassword';
import ForgotPassword from './auth/ForgotPassword';
import Activation from './auth/Activation';
import RequireAuth from './components/RequireAuth';
import { Routes, Route } from 'react-router-dom';
import EditImage from './components/EditImage';

function App() {
  return (
    <div className="App">
      <Header title="electronics guru" />
      <Nav />

      <Routes>
        <Route forceRefresh={true} path="/" element={<Home />} />
        <Route
          exact
          path="/item"
          element={
            <RequireAuth>
              <NewItem />
            </RequireAuth>
          }
        ></Route>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/user_items/:user_id" element={<UserItems />} />
        <Route exact path="/items/:item_id" element={<ItemById />} />
        <Route
          exact
          path="/edit_item/:user_id/item/:particular_item_id"
          element={
            <RequireAuth>
              <EditItem />
            </RequireAuth>
          }
        />
        <Route
          exact
          path="/edit_image/:user_id/item/:particular_item_id"
          element={
            <RequireAuth>
              <EditImage />
            </RequireAuth>
          }
        />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/activation/:token" element={<Activation />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/error" element={<Error />} />
        <Route exact path="/presignup" element={<PreSignup />} />
        <Route exact path="/forgotpassword" element={<ForgotPassword />} />
        {/* profile path has to be protected by RequireAuth after implementation complete */}
        <Route exact path="/profile" element={<Profile />} />
        <Route exact path="/profile_confirm" element={<ProfileConfirm />} />

        <Route exact path="/newpassword/:id" element={<NewPassword />} />
        <Route path="/*" element={<Home />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
