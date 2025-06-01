import React from "react";
import { Container, Row, Col, Table} from "react-bootstrap";
import { FiPhoneCall } from "react-icons/fi";
import { ImMobile } from "react-icons/im";
import { AiOutlineMail } from "react-icons/ai";
const Contact = () => {
  return (
    <>
      <Container style={{ marginTop: "50px" }}>
      <h1 >PizzaVillage</h1>
        <Row>
          <Col md={6}>
            
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores,
              nostrum magni voluptatem perferendis dolorum nisi architecto
              maxime voluptas exercitationem. Omnis, iure laudantium eveniet
              voluptas corrupti deserunt minima. Omnis dolore unde, esse magnam
              animi nesciunt velit impedit eveniet voluptates beatae libero
              laboriosam soluta dolorem odio delectus nisi suscipit quaerat
              repudiandae ratione? Cum fugit inventore porro, ipsum quas
              voluptas? Optio assumenda ut rem totam ea, sequi consequuntur eos
              magnam asperiores fugiat repudiandae dolor rerum praesentium a
              deleniti doloribus exercitationem officiis odio iure quis minus
              omnis quisquam cumque aperiam. Dolorum sed fugit voluptates vel
            
            </p>


          </Col>
          <Col md={6}>
            {/* <Image
              src="images/farmhouse.jpg"
              style={{ width: "100%", height: "50%" }}
            /> */}
            <Table striped bordered hover className="text-center">
              <thead>
                <tr>
                  <th className="bg-warning text-center" colSpan={3}>
                    --- Contact Details ---
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <FiPhoneCall />
                  </td>
                  <td>Phone</td>
                  <td>0123-456789</td>
                </tr>
                <tr>
                  <td>
                    <ImMobile />
                  </td>
                  <td>Call</td>
                  <td>1234567890</td>
                </tr>
                <tr>
                  <td>
                    <AiOutlineMail />
                  </td>
                  <td>Email</td>
                  <td>Help@pizzaVillage.com</td>
                </tr>
              </tbody>
            </Table>
          </Col>
          
        </Row>
      </Container>
    </>
  );
};

export default Contact;
