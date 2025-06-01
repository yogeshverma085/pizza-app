import React, { useEffect } from "react";
import {Container, Button} from "react-bootstrap";
import { useSelector } from "react-redux";
import {Link } from "react-router-dom";
import "./adminScreenStyle.css"
// import AddNewPizza from "../components/Admin/AddNewPizza";
// import OrderList from "../components/Admin/OrderList";
// import Pizzaslist from "../components/Admin/Pizzaslist";
// import Userlist from "../components/Admin/Userlist";
// import EditPizza from "./../components/Admin/EditPizza";
const AdminScreen = () => {
  const userState = useSelector((state) => state.loginUserReducer);
  const { currentUser } = userState;
  useEffect(() => {
    if (localStorage.getItem("currentUser") === null || !currentUser.isAdmin) {
      window.location.href = "/";
    }
  }, [currentUser]);
  return (
    <>
      <Container>
        <h1 className="text-center bg-dark text-light p-2">Admin Panel</h1>

        <div className="text-center" style={{marginTop:"100px"}}>

          <Link to="/admin/userlist">
            <Button className="admin-button">
              All Users
            </Button>
          </Link>


          <Link to="/admin/pizzalist">
            <Button className="admin-button">
              All Pizzas
            </Button>
          </Link>

          <Link to="/admin/addnewpizza">
            <Button className="admin-button">
              Add New Pizza
            </Button>
          </Link>

          <Link to="/admin/orderlist">
            <Button className="admin-button" >
              All orders
            </Button>
          </Link>
        </div>

      </Container>
    </>
  );
};

export default AdminScreen;
