import React, { useState } from "react";
import { Card, Button, Modal, Image } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addToCart } from "../actions/cartAction";
import { BiInfoCircle } from 'react-icons/bi';
import { AiFillTag } from 'react-icons/ai';
import "./pizzaStyle.css";

function ReadMore({ children, maxCharacterCount }) {
  const text = children;
  const [isTruncated, setIsTruncated] = useState(true);
  const resultString = isTruncated ? text.slice(0, maxCharacterCount) : text;

  function togglesIsTruncated() {
    setIsTruncated(!isTruncated);
  }

  return (
    <p className="p-btn">
      {resultString}
      <span onClick={togglesIsTruncated} className="more-btn">
        {isTruncated ? "  ...more" : "...less"}
      </span>
    </p>
  )
}

const Pizza = ({ pizza }) => {

  const [varient, setVarient] = useState("small");
  const [quantity, setQuantity] = useState(1);
  const [show, setShow] = useState(false);
  const [buttonText, setButtonText] = useState('ADD');


  const dispatch = useDispatch();

  const addToCartHandler = () => {
    dispatch(addToCart(pizza, quantity, varient));
  };

  const change = () => {
    setButtonText('ADDED')
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  return (
    <>
      <div className="maincard">
        {/* { border:"none",borderRadius:"13px",alignItems:"center",justifyContent:"center" ,width: "16.8rem", marginTop: "30px", marginLeft:"0px", fontSize:"13px", backgroundColor:"#dc999982"} */}
        <div className="card-image cia">
          <Card.Img
            className="card-img"
            variant="top"
            src={pizza.image}
            // style={{ height: "240px",marginTop:"3px" ,cursor: "pointer",borderTopRightRadius:"13px", borderTopLeftRadius:"13px",}}
            onClick={handleShow}
          />

        </div>

        <div className="card-body">

          {/* <Card.Title name > */}
          <h6 className="name">{pizza.name}</h6>
          {/* </Card.Title> */}


          {/* ******Star**** */}

          <div className="d-flex align-items-center " style={{ marginTop: "7px" }}>
            <div className="rating-stars">
              <Image className="star-image" src="images/grey-star.svg" />
              <div className="filled-star"></div>
            </div>
            &nbsp;
            <h6
              className="rating-text"
              style={{
                marginTop: "0px",
                fontWeight: "lighter",
                opacity: "0.6",
              }}
            >
              (4.5)
            </h6>
          </div>



          {/* <Card.Text> */}

          {/* discription */}
          <div className="discc"><ReadMore maxCharacterCount={23}>{pizza.description}</ReadMore></div>

          {/* varients and quantity */}
          <div className="divv">

            <div className="left">
              <select
                className="form-select select-varient"
                value={varient}
                onChange={(e) => setVarient(e.target.value)}
              >
                {pizza.varients.map((varient) => (
                  <option key={varient}>{varient}</option>
                ))}
              </select>
            </div>

            <div className="right">
              <select
                className="form-select select-quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              >
                {[...Array(5).keys()].map((v, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

          </div>
          {/* </Card.Text> */}

          <div className="d-flex align-items-baseline">

            <div className="b-left">
              {/* align-items-baseline */}
              <div className="d-flex">
                <h4 className=" price" style={{ color: "rgb(222, 31, 10)" }}>&#8377;{pizza.prices[0][varient] * quantity}</h4>
                <h4 className="price offer-tag-mobile" ><AiFillTag/> Flat &#8377;100 off</h4>
              </div>
              <div className="space-after-price">&nbsp;&nbsp;&nbsp;</div>
            </div>

            <div className="b-mid" >
              <h5 style={{ marginLeft: "10px" }} className="text-success price">10%off</h5>
            </div>

            <div className="b-right"  >
              <Button

                onClick={() => { addToCartHandler(); change(); }}
                className=" card-button"
                id="box"
                key={pizza.name}
                style={{ marginRight: "5px" }}

              >
                {buttonText}
              </Button>
            </div>

          </div>

          {/* item details button for mobile */}

          <div onClick={handleShow} className="item-details">
            <div className="item-details-icon">
              <BiInfoCircle />
            </div>
            <div className="item-details-text">
              <p>item Details</p>
            </div>
          </div>


        </div>
        <div className="card-image cib">
          <div className="upr-div">
            <Image fluid="true"
              className=" card-img"
              variant="top"
              src={pizza.image}
              // style={{ height: "240px",marginTop:"3px" ,cursor: "pointer",borderTopRightRadius:"13px", borderTopLeftRadius:"13px",}}
              onClick={handleShow}
            />
          </div>
          <div >
            <Button fluid="true"
              className="lwr-div"
              onClick={() => { addToCartHandler(); change(); }}
              id="box"
              key={pizza.name}
              style={{ marginRight: "5px" }}
            >
              {buttonText}
            </Button>
          </div>
        </div>


      </div>

      {/* modal */}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton >
          <div>
            <div className="model-name">
              <Modal.Title>{pizza.name}</Modal.Title>
            </div>
            {/* model start */}
            <div className="d-flex align-items-center " style={{ marginTop: "7px" }}>
              <div className="rating-stars">
                <Image className="star-image" src="images/grey-star.svg" />
                <div className="filled-star"></div>
              </div>
              &nbsp;
              <h6
                className="rating-text model-rating-text"
                style={{
                  marginTop: "0px",
                  fontWeight: "lighter",
                  opacity: "0.6",
                }}
              >
                (4.5)
              </h6>
            </div>


            <div className="model-discc">
              <h6 >{pizza.description}</h6>
            </div>

            <div className="model-lwr">

              <div className="model-price price">
                <h4 style={{ color: "rgb(222, 31, 10)" }}>&#8377;{pizza.prices[0][varient] * quantity}</h4>
              </div>

              <div className="model-btn">
                <Button
                  onClick={() => { addToCartHandler(); change(); }}
                  className="model-button"
                  id="box"
                  key={pizza.name}
                  style={{ marginRight: "5px" }}
                >
                  {buttonText}
                </Button>
              </div>

            </div>
          </div>
        </Modal.Header>
        {/* <Modal.Body> */}
        <div className="model-img">
          <Card.Img
            variant="top"
            src={pizza.image}
            style={{ height: "250px" }}
          />
        </div>
      </Modal>
    </>
  );
};

export default Pizza;
