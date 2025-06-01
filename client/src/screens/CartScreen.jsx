import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { FaMinusCircle, FaPlusCircle, FaTrash } from "react-icons/fa";
import { addToCart, deleteFromCart } from "../actions/cartAction";
import Checkout from "../components/Checkout";
import "./cartStyle.css"

const CartScreen = () => {
  const cartState = useSelector((state) => state.cartReducer);
  const cartItems = cartState.cartItems;
  const dispatch = useDispatch();
  const subTotal = cartItems.reduce((x, item) => x + item.price, 0);
  return (
    <>
      <Container className="cart-main">
        <div className="cart-notice">
          <h6 className="cart-notice-text" >Currently we are only delivering to Dwarka(110075), Dwarka mor(110059), Dwarka sec 14(110078) and Jankapuri(110048), Please enter the pincode in payment details that are mention here to having order otherwise we'll not deliver to except these pincode. </h6>
        </div>
        <hr></hr>
        <Row>
          <Col md={6}>
            <h4>My Cart</h4>
            <hr></hr>

            <Container>
              <Row >
                {cartItems.map((item) => (
                  <>

                    <Col md={8}>

                      <div className="name-div">
                        <h5 style={{ display: "flex" }} className="pizza-name sm-text">
                          {item.name}
                          <p className="pizza-variety sm-text">
                            [{item.varient}]
                          </p>

                        </h5>
                        <h6 className="disc">
                          {item.description}
                        </h6>

                      </div>

                      {/* up down button */}

                      <div className="btn-div">
                        <div style={{ paddingBottom: "10px" }}>
                          {/* Quantity :&nbsp; */}

                          <div className="updown-button">
                            &nbsp;
                            <FaMinusCircle
                              className="text-danger up-down-btn"
                              style={{ cursor: "pointer", width: "35px" }}
                              onClick={() => {
                                dispatch(
                                  addToCart(item, item.quantity - 1, item.varient)
                                );
                              }}
                            />{" "}
                            &nbsp;&nbsp;
                            <div className="count up-down-btn" >
                              {item.quantity}
                            </div>
                            &nbsp;&nbsp;
                            <FaPlusCircle
                              className="text-success up-down-btn"
                              style={{ cursor: "pointer", width: "35px" }}
                              onClick={() => {
                                dispatch(
                                  addToCart(item, item.quantity + 1, item.varient)
                                );
                              }}
                            />&nbsp;
                          </div>


                        </div>

                        {/* price  */}

                        <div>
                          <h5 className="sm-text" style={{ color: "rgb(169, 67, 3)" }}>&#8377; {item.price}</h5>
                        </div>
                      </div>

                    </Col>
                    <Col md={4} className="img-btn">

                      <img

                        alt={item.name}
                        src={item.image}
                        style={{ width: "80px", height: "80px", borderRadius: "50%" }}
                      />
                      <FaTrash
                        className="text-danger"
                        style={{ cursor: "pointer", marginLeft: "20px" }}
                        onClick={() => {
                          dispatch(deleteFromCart(item));
                        }}

                      />

                    </Col>
                    <hr />
                  </>
                ))}
              </Row>
            </Container>

          </Col>

          <Col md={1}>
            {""}
          </Col>


          <Col md={5} className="bill-main">
            <h4>Bill Details</h4>
            <hr></hr>

            {/*             
            <Row className="bill-div">
                <Col md={8}>
                  <h6 className="left">Item Total</h6>
                </Col>

                <Col md={4} >
                  <h6 className="right">&#8377; {subTotal} /-</h6>
                </Col>

            </Row>

            <Row className="bill-div">
              <Col md={8}>
                <h6 className="left">Delivery Fee</h6>
              </Col>
              <Col md={4}>
                <h6 className="text-success right">Free</h6>
              </Col>
            </Row>
            &nbsp;

            <Row className="bill-div">
              <Col md={8}>
                <h6>Taxes and Charges</h6>
              </Col>
              <Col md={4}>
               
                <h6 className="text-success right">0.00%</h6>
              </Col>
            </Row>

            <hr />

            <Row className="bill-div">
              <Col md={8}>
                <h5 className="left">Sub Total</h5>
              </Col>
              <Col md={4}>
               
                <h5 className="right">&#8377; {(subTotal)}/-</h5>

              </Col>
              <Col >
                <Checkout subTotal={subTotal} />
              </Col>

            </Row> */}
            <Container style={{ display: "inline" }}>

              {/* left side */}
              <div className="bill-left">
                <h6 >
                  item total :
                </h6>
                <h6 >
                  delivery fees :
                </h6>
                <h6 >
                  tex & charges :
                </h6>
                <hr />
                <h5>subtotal :</h5>
              </div>

              {/* right side */}
              <div className="bill-right">
                <h6>
                  &#8377;{subTotal}
                </h6>
                <h6 className="text-success">
                  free
                </h6>
                <h6>
                  &#8377;0.00
                </h6>
                <hr />
                <h5>&#8377;{subTotal}</h5>
                <hr />

                {/* pay button */}

                <div style={{ marginBottom: "30px" }}>
                  <Checkout subTotal={subTotal} />
                </div>

              </div>
            </Container>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CartScreen;
