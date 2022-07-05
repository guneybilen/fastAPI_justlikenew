import Header from './components/Header';
import Nav from './components/Nav';
import Footer from './components/Footer';
import About from './components/About';
import Home from './components/Home';
import UpdateItem from './components/UpdateItem';
import Login from './auth/Login';
import Signup from './auth/Signup';
import NewPassword from './auth/NewPassword';
import ForgotPassword from './auth/ForgotPassword';
import Activation from './auth/Activation';
import ItemPage from './components/ItemPage';
import { useStoreActions } from 'easy-peasy';
import { useEffect } from 'react';
import useAxiosFetch from './hooks/useAxiosFetch';
import RequireAuth from './components/RequireAuth';
import { Routes, Route } from 'react-router-dom';

// for api variable see /etc/nginx/sites-enabled
// let url = '/';

function App() {
  const setUsers = useStoreActions((actions) => actions.setUsers);
  const { data } = useAxiosFetch(`/items/all`);

  useEffect(() => {
    // console.log(data);
    setUsers(data);
  }, [data, setUsers]);

  return (
    <div className="App">
      <Header title="electronics guru" />
      <Nav />
      <Routes>
        <Route forceRefresh={true} path="/" element={<Home />} />
        <Route path="/activation/:token" element={<Activation />} />
        <Route path="/login/" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="items/:id" element={<ItemPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/newpassword/:id/" element={<NewPassword />} />
        <Route path="/update/:id/" element={<UpdateItem />} />
      </Routes>
      <RequireAuth />
      <Footer />
    </div>
  );
}

export default App;
