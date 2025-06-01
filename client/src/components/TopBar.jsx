import React from 'react'
import { Nav, Container } from 'react-bootstrap';
// import { LinkContainer} from 'react-router-bootstrap';
// import { MdLocalOffer } from "react-icons/md";
import "./topbarStyle.css"
// import { Link } from 'react-bootstrap/lib/Navbar';
// import { Link } from "react-router-dom";


const TopBar = () => {
    return (

        <>
            {/* <div className='boxx'> */}
            {/* <Navbar bg="dark" variant="dark" expand="lg" className='topbar'  > */}
            <Container fluid >
                {/* <h6 className="text-light">
                        <MdLocalOffer className="text-warning" /> &nbsp;&nbsp; Buy 1 Get 1 On Medium Pizza
                    </h6> */}

                <Nav className="m-auto nav">
                    <Nav.Item>
                         <Nav.Link className="items" href="/">Home</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                         <Nav.Link className="items" href="/about">About Us</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                         <Nav.Link className="items" href="/contact">Contact Us</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                         <Nav.Link className="items" href="/policy">Terms & Policy</Nav.Link>
                    </Nav.Item>

                    {/* <LinkContainer to="/" activeClassName=""  >
                        <Nav.Link className="items">Home</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/about" activeClassName="">
                        <Nav.Link className="items">About Us</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/contact" activeClassName="">
                        <Nav.Link className="items">Contact Us</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/policy" activeClassName="">
                        <Nav.Link className="items">terms and policy</Nav.Link>
                    </LinkContainer> */}
                </Nav>

                {/* <Nav className="m-auto nav">
                  
                        <Nav.Link as={Link} to="/" className="items">Home</Nav.Link>
                        <Nav.Link as={Link} to="/about" className="items">About Us</Nav.Link>
                        <Nav.Link as={Link} to="/contact" className="items">Contact Us</Nav.Link>
                        <Nav.Link as={Link} to="/policy" className="items">terms and policy</Nav.Link>

                </Nav> */}
            </Container>
            {/* </Navbar> */}
            {/* </div> */}
        </>
    )
}

export default TopBar
