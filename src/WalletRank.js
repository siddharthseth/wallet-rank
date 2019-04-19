import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'bulma/css/bulma.css';
import './WalletRank.css';
import UserGraph from './components/UserGraph/UserGraph.js';
import NavBar from './components/NavBar/NavBar.js';
import Footer from './components/Footer/Footer.js';
import * as d3 from "d3";

class WalletRank extends Component {

  constructor(props) {
    super(props);
    this.API_URL = 'http://ec2-54-67-52-170.us-west-1.compute.amazonaws.com:3000/';
    this.NEIGHBOR_API = this.API_URL + 'neighbor/';
    this.SCORE_API = this.API_URL + 'walletrank/';
    this.INFO_API = this.API_URL + 'wallet_info/';
    this.INITIAL_BAD_USER = 54186999;

    this.state = {
      users: {},
      links: [],
      isMounted: false,
      loaders: 0
    }
    this.loaderStart = this.loaderStart.bind(this);
    this.loaderEnd = this.loaderEnd.bind(this);
    this.searchUser = this.searchUser.bind(this);
    this.removeUser = this.removeUser.bind(this);
  }

  loadUsersAndLinks(id, is_parent) {
    this.loaderStart();

    if (is_parent) {
      var promises = [
        d3.json(this.SCORE_API + id),
        d3.json(this.INFO_API + id),
        d3.json(this.NEIGHBOR_API + id)
      ];
    } else {
      var promises = [
        d3.json(this.SCORE_API + id),
        d3.json(this.INFO_API + id)
      ];
    }

    Promise.all(promises).then((res) => {
      var state_users = {};
      var state_links = [];
      var score = res[0];

      state_users[id] = {
        name: id,
        is_parent: is_parent
      }
      console.log(state_users);

      if (is_parent) {
        var neighbors = res[2]
        for (var i = neighbors['in'].length - 1; i >= 0; i--) {
          let in_id = neighbors['in'][i][0];
          state_links.push({
            source: in_id,
            target: id
          });
          state_users[in_id] = {
            name: in_id,
            is_parent: false
          };
          // this.loadUsersAndLinks(in_id, false);
        }

        for (var i = neighbors['out'].length - 1; i >= 0; i--) {
          let out_id = neighbors['out'][i][0];
          state_links.push({
            source: id,
            target: out_id
          });
          state_users[out_id] = {
            name: out_id,
            is_parent: false
          };
          // this.loadUsersAndLinks(out_id, false);
        }
      }

      if (this.state.isMounted) {
        this.setState({
          users: {...this.state.users, ...state_users},
          links: [...this.state.links, ...state_links],
        });
        this.loaderEnd();
      }
    });
  }

  loaderStart() {
    this.setState({
      loaders: this.state.loaders+1
    });
  }

  loaderEnd() {
    this.setState({
      loaders: this.state.loaders-1
    });
  }

  componentDidMount() {
    this.setState({
      isMounted: true
    });
    this.loadUsersAndLinks(this.INITIAL_BAD_USER, true);
  }

  componentWillUnmount() {
    this.state.isMounted = false;
  }

  // TODO(sid): update this function
  searchUser(e) {
    // Prevent button click from submitting form
    e.preventDefault();

    let users = this.state.users;
    const newUser = document.getElementById("searchInput");
    const form = document.getElementById("searchUser");

    if (newUser.value === "") {
      // No input, make border red to signify value is required
      newUser.classList.add("is-danger");
    } else {
      users[newUser.value] = {
        id: newUser.value,
        rank: 675
      };
      this.setState({
        users: users
      });

      newUser.classList.remove("is-danger");
      form.reset();
    }
  }

  // TODO(sid): update this function 
  removeUser(user) {
    let users = this.state.users;

    delete users[user.name];

    this.setState({
      users: users
    });
  }

  render() {
    let loaders = this.state.loaders;
    return (
      <div className="WalletRank">
        <div className="container">
          <NavBar/>

          <UserGraph 
            users={this.state.users}
            links={this.state.links}
            width="800" 
            height = "600"
            loadUser={this.loadUsersAndLinks.bind(this)} />

          <Footer/>
        </div>
      </div>
    );
  }
}

export default WalletRank;