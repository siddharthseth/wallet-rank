import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'bulma/css/bulma.css';
import './WalletRank.css';
import UserGraph from './components/UserGraph/UserGraph.js';
import * as d3 from "d3";

class WalletRank extends Component {

  constructor(props) {
    super(props);

    this.state = {
      users: {},
      links: []
    }

    this.searchUser = this.searchUser.bind(this);
    this.removeUser = this.removeUser.bind(this);
    this.loadUsersAndLinks();
  }

  loadUsersAndLinks() {
    var state_users = {};
    var state_links = [];

    let promises = [
      d3.csv("users.csv", function(d) {
        return {
          name: d.WalletId,
          rank: +d.Rank
        }
      }),
      d3.csv("links.csv", function(d) {
        return {
          source: d.Source,
          target: d.Target
        }
      })
    ];

    Promise.all(promises).then(([users, links]) => {
      this.setState({
        users: users.reduce((acc, cur) => ({ ...acc, [cur.name]: cur}), {}),
        links: links
      });
    });
  }


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

  removeUser(user) {
    let users = this.state.users;

    delete users[user.name];

    this.setState({
      users: users
    });
  }

  render() {
    return (
      <div className="WalletRank">
        <div className="container">
          <section className="search">
            <h1>Add users to track:</h1>
            <form className="search" id="searchUser">
              <input
                type="text"
                className="input"
                id="searchInput"
                placeholder="Add a user to track..."
              />
              <button className="button is-info" onClick={this.searchUser}>
                Add User
              </button>
            </form>
          </section>

          <UserGraph 
            users={this.state.users}
            links={this.state.links}
            width="800" 
            height = "500"/>

          <section className="users">
            <h1>Current users being tracked:</h1>
            <ul>
              {Object.keys(this.state.users).map((key, index) => (
                <li key={key}>
                  {key} &nbsp;
                  <span
                    className="delete"
                    onClick={() => this.removeUser(this.state.users[key])}
                  />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    );
  }
}

export default WalletRank;