import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { registerUser } from "../actions/userAction";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";
import Success from "../components/Success";
import Error from "../components/Error";
import "./registerStyle.css"

const Registe = () => {
  const registerState = useSelector((state) => state.registerUserReducer);
  const { error, success, loading } = registerState;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confrimPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();

  const registerhandler = () => {
    if (password !== confrimPassword) {
      alert("Password do not match");
    } else {
      const user = { name, email, password, confrimPassword };
      dispatch(registerUser(user));
    }
  };
  return (
    <>
      <Container className="mainnn">
        {loading && <Loader />}
        {success && <Success success="User Register Successfully" />}
        {error && <Error error="somthing went wrong" />}
        <h1 style={{ textAlign: "center" }} >Registration </h1>
        <Form >
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label >Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Form.Text className="text-muted">
              your email is secure.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
            <Form.Label>Confrim Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              value={confrimPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>

          <Button className="buttonn" variant="primary" onClick={registerhandler}>
            Register
          </Button>

        </Form>
      </Container>
    </>
  );
};

export default Registe;
