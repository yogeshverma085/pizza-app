import React, { useEffect } from "react";
import { Navbar, Nav, Container, Image, NavDropdown } from "react-bootstrap";
import "./NavStyle.css"
// import {Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GrCart } from 'react-icons/gr';
import { FaUserCircle } from 'react-icons/fa';
// import { LinkContainer } from "react-router-bootstrap";
import { logoutUser } from "../actions/userAction";

const NavBar = () => {
  const dispatch = useDispatch();
  const cartState = useSelector((state) => state.cartReducer);
  const { cartItems } = cartState;
  const userState = useSelector((state) => state.loginUserReducer);
  const { currentUser } = userState;

  useEffect(() => {
    // to hide or show admin button for admin or user
    if (localStorage.getItem("currentUser") === null || !currentUser.isAdmin) {
      document.querySelector('.admin').style.display = 'none';
    }
  }, [currentUser]);
  return (
    <>
      <Navbar collapseOnSelect bg="light" variant="light" className="box">
        <Container fluid className="l-box" >

          <Navbar.Brand >
            {/* <LinkContainer to="/">
              <NavDropdown.Item>
                <Image
                  className="img"
                  src="images/logo.jpg"
                  alt="PIZZA VILLAGE"

                />
              </NavDropdown.Item>
            </LinkContainer> */}
            
            <Nav.Item>
              <NavDropdown.Item href="/">
                <Image
                  className="img"
                  src="images/logo.jpg"
                  alt="PIZZA VILLAGE"

                />
              </NavDropdown.Item>
            </Nav.Item>
          </Navbar.Brand>
          {/* style={{float:"inline-start"}} */}

          <Navbar.Toggle aria-controls="responsive-navbar-nav" />

          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto">
              {currentUser ? (
                <Nav.Item>
                
                  <NavDropdown href="/" className="drop" title={<FaUserCircle />} id="basic-nav-dropdown">
                    <NavDropdown.Item className="drop-item">{currentUser.name}</NavDropdown.Item><hr />
                    <Nav.Item>
                      <NavDropdown.Item href="/orders" className="drop-item">orders</NavDropdown.Item>
                    </Nav.Item>
                    <NavDropdown.Item
                      className="drop-item"
                      onClick={() => {
                        dispatch(logoutUser());
                      }}
                    >
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav.Item>
              ) : (
                <>
                  {" "}
                  <Nav.Item>
                    <Nav.Link href="/login">Login</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link href="/register">Register</Nav.Link>
                  </Nav.Item>{" "}
                </>
              )}

              <Nav.Item className="admin">
                <Nav.Link href="/admin">Admin</Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link href="/cart">
                  <div className="cartt">
                    <div> <GrCart /> </div>
                    <div className="count-icon">{cartItems.length}</div>
                  </div>
                </Nav.Link>
              </Nav.Item>


            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
