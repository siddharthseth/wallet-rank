import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './NavBar.css';
import 'bulma/css/bulma.css';
import { Button, Form, FormControl} from 'react-bootstrap';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.searchUser = this.searchUser.bind(this);
  }

  // TODO(sid): update this function
  searchUser(e) {
    // Prevent button click from submitting form
    e.preventDefault();

    const newUser = document.getElementById("searchInput");
    const form = document.getElementById("searchUser");

    if (newUser.value === "") {
      // No input, make border red to signify value is required
      newUser.classList.add("is-danger");
    } else {
      this.props.loadUser(+newUser.value, true);
      newUser.classList.remove("is-danger");
      form.reset();
    }
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
        <Form id="searchUser" inline>
          <FormControl id="searchInput" type="text" placeholder="Search for user..." className="mr-sm-2" />
          <Button onClick={this.searchUser} variant="outline-info">Search</Button>
        </Form>
      </Navbar>
    );
  }
}

export default NavBar;