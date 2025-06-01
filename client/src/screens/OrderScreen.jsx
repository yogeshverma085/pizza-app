import React, { useEffect } from "react";
import { getUserOrders } from "../actions/orderAction";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import Loader from "../components/Loader";
import Error from "../components/Error";
import "./orderScreenStyle.css"

const OrderScreen = () => {
  const orderState = useSelector((state) => state.getUserOrdersReducer);
  const { loading, error, orders } = orderState;
  const dispatch = useDispatch();
  // const userState = useSelector((state) => state.loginUserReducer);
  // const { currentUser } = userState;
  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);
  return (
    <>
      <h1 className="text-center " style={{ color: "rgb(243, 115, 36)" }}>Your Orders </h1>
      {loading && <Loader />}
      {error && <Error error="something went wrong" />}

      {orders &&
        orders.map((order) => (
          <div className="container border p-4 bg-light order-main">
            <Row>
              <Col md={4}>
                <h4>Items</h4>
                <h5 className="text-success">Total Amount : &#8377; {order.orderAmount}</h5>
                {order.orderItems.map((item) => (
                  // <h6>Order Amount : &#8377; {order.orderAmount}</h6>
                  <h6 key={item.name}>
                  {/* <h6 key={currentUser._id}> */}
                    {item.quantity}x  {item.name} ({item.varient}) ={" "}
                    &#8377; {item.price}&nbsp;
                  </h6>



                ))}
              </Col>
              <Col md={3}>
                <h4>Address</h4>
                <h6>Street : {order.shippingAddress.street}</h6>
                <h6>City : {order.shippingAddress.city}</h6>
                <h6>PinCode : {order.shippingAddress.picode}</h6>
                <h6>Country : {order.shippingAddress.country}</h6>
              </Col>
              <Col md={5}>
                <h4 style={{ color: "" }}>Order Info</h4>
                {/* <h6>Order Amount : &#8377; {order.orderAmount}</h6> */}
                <h6>Transection id : {order.transectionId}</h6>
                <h6>Order id : {order._id}</h6>
                <h6>Date : {order.createdAt.substring(0, 10)}</h6>
                <h6>Time : {order.createdAt.substring(11, 16)}</h6>

              </Col>
            </Row>
            <div className="order-time-div">
              {/* ***************Area and pincode setup*********** */}

              {/* dwarka mod */}
              {/* {order.shippingAddress.picode == 110059 && <h2 className="order-time-text"> Be Patience ! Your order will deliver in&nbsp; <h1 className="order-time-text-price"> 25 min</h1>&nbsp;approx</h2>} */}
              {/* dwarka */}
              {/* {order.shippingAddress.picode === "110075" && <h2 className="order-time-text"> Be Patience ! Your order will deliver in&nbsp; <h1 className="order-time-text-price"> 32 min</h1>&nbsp;approx</h2>} */}
              {/* dwarka sec 14 */}
              {/* {order.shippingAddress.picode === "110078" && <h2 className="order-time-text"> Be Patience ! Your order will deliver in&nbsp; <h1 className="order-time-text-price"> 40 min</h1>&nbsp;approx</h2>} */}
              {/* janakpuri */}
              {/* {order.shippingAddress.picode === "110048" && <h2 className="order-time-text"> Be Patience ! Your order will deliver in&nbsp; <h1 className="order-time-text-price"> 45 min</h1>&nbsp;approx</h2>} */}

              {order.shippingAddress.picode === "110059" ?
                (<h2 className="order-time-text"> Be Patience ! Your order will deliver in&nbsp; <h1 className="order-time-text-price"> 25 min</h1>&nbsp;approx</h2>)
                : order.shippingAddress.picode === "110075" ?
                  (<h2 className="order-time-text"> Be Patience ! Your order will deliver in&nbsp; <h1 className="order-time-text-price"> 32 min</h1>&nbsp;approx</h2>)
                  : order.shippingAddress.picode === "110078" ?
                    (<h2 className="order-time-text"> Be Patience ! Your order will deliver in&nbsp; <h1 className="order-time-text-price"> 40 min</h1>&nbsp;approx</h2>)
                    : order.shippingAddress.picode === "110048" ?
                      (<h2 className="order-time-text"> Be Patience ! Your order will deliver in&nbsp; <h1 className="order-time-text-price"> 45 min</h1>&nbsp;approx</h2>)
                      : (<h2 className="order-time-text"> Sorry, curently we are not delivering at this address</h2>)}



            </div>
          </div>
        ))}
    </>
  );
};

export default OrderScreen;
