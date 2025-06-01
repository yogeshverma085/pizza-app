// import logo from "./logo.svg";
import React from "react"; // "react/react-in-jsx-scope": "off" error will show when this line is cut.
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import TopBar from "./components/TopBar";
import NavBar from "./components/NavBar";
import About from "./components/About";
import Policy from "./components/Policy";
import Contact from "./components/Contact";
import HomeScreen from "./screens/HomeScreen";
import CartScreen from "./screens/CartScreen";
import Registe from "./screens/Registe";
import Login from "./screens/Login";
import OrderScreen from "./screens/OrderScreen";
import AdminScreen from "./screens/AdminScreen";
import Userlist from "./components/Admin/Userlist";
import Pizzaslist from "./components/Admin/Pizzaslist";
import AddNewPizza from "./components/Admin/AddNewPizza";
import OrderList from "./components/Admin/OrderList";

function App() {
  return (
    <BrowserRouter>
      <TopBar />
      <NavBar /> 

      <Routes>

        
        <Route path="/admin" element={<AdminScreen />} />
        <Route path="/" element={<HomeScreen />} exact />
        <Route path="/about" element={<About />} exact />
        <Route path="/contact" element={<Contact />} exact />
        <Route path="/policy" element={<Policy />} exact />
        <Route path="/orders" element={<OrderScreen/>} exact />
        <Route path="/login" element={<Login />} exact />
        <Route path="/register" element={<Registe />} exact />
        <Route path="/cart" element={<CartScreen />} exact />

        {/* *********Admin Routes******* */}

        <Route path="/admin/userlist" element={< Userlist/>} />
        <Route path="/admin/pizzalist" element={< Pizzaslist/>} />
        <Route path="/admin/addnewpizza" element={< AddNewPizza/>} />
        <Route path="/admin/orderlist" element={< OrderList/>} />
        
      
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;
      
     

