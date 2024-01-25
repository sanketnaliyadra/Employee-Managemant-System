import React from "react";
import { Link, Outlet } from "react-router-dom";
import { Navbar, Container, Nav, Offcanvas } from "react-bootstrap";

const Header = () => {
  return (
    <>
      <Navbar expand="lg" bg="dark" className="mb-3 nav-wrapper">
        <Container fluid>
          <Navbar.Brand as={Link} to="/" className="text-white">
            Employee Management
          </Navbar.Brand>
          
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Nav.Item>
                  <Nav.Link as={Link} to="/" className="text-white">
                    Home
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={Link} to="/table" className="text-white">
                    Employee Table
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={Link} to="/create" className="text-white">
                    Employee Create
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={Link} to="/upcomingRetirenment" className="text-white">
                    Upcoming Retirnement
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Offcanvas.Body>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
};

export default Header;
