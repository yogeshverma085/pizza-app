import React, { useState } from "react";
import { Form, Col, Row, Button, Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { filterPizza } from "../actions/pizzaAction";
import "./filterStyle.css"
const Filters = () => {
  const [searchkey, setsearchkey] = useState("");
  const [category, setcategory] = useState("all");
  const dispatch = useDispatch();
  return (
    <Container style={{ display: "flex", justifyContent: "center" }}>
      <div className="p-2 filter-main"  >
        <Row >
          <Col className="col">
            <Form.Control
              className="mobile-size"
              style={{ borderRadius: "15px" }}
              value={searchkey}
              onChange={(e) => setsearchkey(e.target.value)}
              placeholder="search pizza"
            />
          </Col>
          <Col className="col">
            <select
              style={{ borderRadius: "15px" }}
              className="form-select mobile-size"
              value={category}
              onChange={(e) => setcategory(e.target.value)}
            >
              <option className="mobile-size">all</option>
              <option className="mobile-size">veg</option>
              <option className="mobile-size">nonveg</option>
            </select>
          </Col>
          <Col className="col ">
            <Button
              className="filter-button mobile-size"
              onClick={() => {
                dispatch(filterPizza(searchkey, category));
              }}
            >
              Search
            </Button>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default Filters;
