import Header from './components/Header';
import Nav from './components/Nav';
import Footer from './components/Footer';
import About from './components/About';
import Home from './components/Home';
import NewItem from './components/NewItem';
import EditItem from './components/EditItem';
import Login from './auth/Login';
import Signup from './auth/Signup';
import Error from './auth/Error';
import PreSignup from './auth/PreSignup';
import NewPassword from './auth/NewPassword';
import ForgotPassword from './auth/ForgotPassword';
import Activation from './auth/Activation';
import RequireAuth from './components/RequireAuth';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Header title="electronics guru" />
      <Nav />

      <Routes>
        <Route forceRefresh={true} path="/" element={<Home />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/user_items/:id" element={<Home />} />
        <Route
          exact
          path="/edit_item/:user_id/item/:particular_item_id"
          element={
            <RequireAuth>
              <EditItem />
            </RequireAuth>
          }
        />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/activation/:token" element={<Activation />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/error" element={<Error />} />
        <Route exact path="/presignup" element={<PreSignup />} />
        <Route exact path="/forgotpassword" element={<ForgotPassword />} />
        <Route exact path="/newpassword/:id" element={<NewPassword />} />
        <Route
          exact
          path="/item"
          element={
            <RequireAuth>
              <NewItem />
            </RequireAuth>
          }
        ></Route>
        <Route path="/*" element={<Login />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
