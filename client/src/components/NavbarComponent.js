import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';

const NavbarComponent = ({ isLoggedIn, handleLogin }) => {
  const history = useHistory();

  const handleLogout = () => {
    handleLogin(false);
    history.push('/login');
  };

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand as={Link} to="/">SavorySagas.com</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          {isLoggedIn ? (
            <>
              <Nav.Link as={Link} to="/recipes">Recipes</Nav.Link>
              <Button onClick={handleLogout} variant="outline-success">Logout</Button>
            </>
          ) : (
            <Nav.Link as={Link} to="/login">Login</Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavbarComponent;
