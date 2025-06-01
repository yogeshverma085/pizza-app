import React from "react";
import { Button, Row, Col } from "react-bootstrap";
import StripeCheckout from "react-stripe-checkout";
import { useDispatch, useSelector } from "react-redux";
import { placeOrder } from "../actions/orderAction";
import Loader from "./Loader";
import Error from "./Error";
import Success from "./Success";
// import swal from 'sweetalert';


const Checkout = ({ subTotal }) => {
  const orderState = useSelector((state) => state.placeOrderReducer);
  const { loading, error, success } = orderState;
  const dispatch = useDispatch();
  const tokenHandler = (token) => {
    dispatch(placeOrder(token, subTotal));
    console.log(token);
  };
  return (
    <>
      {loading && <Loader />}
      {error && <Error error="something went wrong" />}
      {success && <Success success="order placed success, you can check order details in 'orders' (dropdown of user name)"/>}
      {/* swal("Payment done", "your order done success", "success") && (window.location.reload) &&  */}
      {/* {success && window.location.reload && <Success success="order placed success" />} */}

      {/* {success && <Alert><h6>hlo</h6></Alert>} */}
      {/* {success && <Success success="order placed success" />} */}
      <Row >
        <Col>
          <StripeCheckout
            amount={subTotal * 100}
            shippingAddress
            token={tokenHandler}
            stripeKey="pk_test_51HT3awLRpPHpN9zVZksDRZ16m6HANATIi914WwDG7xbmNKQGsMyXEBTuUxlNZlkZ3EYFsfu5t0NQDeNQYbukyICZ000lVzvD9Y"
            // stripeKey="pk_test_51LH6INSFTx2A5G6IoL8qbLOYpWDWrdXZqb3WuGH9BF3MpRxtorBfgvvICXMCOfvwmrL043fXFRVmIQ5paUi5lQW600TwV5p0iU"
            currency="INR"
          >
            <Button>Pay Now</Button>
          </StripeCheckout>
        </Col>
      </Row>
    </>
  );
};

export default Checkout;
