import React from "react";
import { Alert } from "react-bootstrap";
const Success = ({ success }) => {
  return <Alert style={{textAlign:"center"}} variant="success">{success}</Alert>;
};

export default Success;
