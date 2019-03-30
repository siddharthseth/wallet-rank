import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './NavBar.css';
import { Button, Form, FormControl} from 'react-bootstrap';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

class NavBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Navbar className="navbar" bg="dark" variant="dark">
        <Navbar.Brand href="#home">WalletRank</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#favorites">Favorites</Nav.Link>
          <Nav.Link href="#how">How it works </Nav.Link>
          <Nav.Link href="#about">About us</Nav.Link>
        </Nav>
        <Form inline>
          <FormControl type="text" placeholder="Search for user..." className="mr-sm-2" />
          <Button variant="outline-info">Search</Button>
        </Form>
      </Navbar>
    );
  }
}

export default NavBar;