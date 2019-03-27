import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'bulma/css/bulma.css';
import './WalletRank.css';
import UserGraph from './components/UserGraph/UserGraph.js';

class WalletRank extends Component {

  constructor(props) {
    super(props);

    this.searchUser = this.searchUser.bind(this);
    this.removeUser = this.removeUser.bind(this);

    this.state = {
      users: {
        "9jds90afj0sd9fisajf": {
          name: "9jds90afj0sd9fisajf",
          rank: 700
        },
        "jfa8dsjf9ajdsfojdas": {
          name: "jfa8dsjf9ajdsfojdas",
          rank: 650
        }
      },
      links: [
        {
          "source": "9jds90afj0sd9fisajf",
          "target": "jfa8dsjf9ajdsfojdas" 
        }
      ]
    };
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
      users.push({
        id: newUser.value,
        rank: 675
      });
      this.setState({
        users: users
      });

      newUser.classList.remove("is-danger");
      form.reset();
    }
  }

  removeUser(user) {
    const users = this.state.users.slice();

    users.some((usr, i) => {
      if (usr.id === user.id) {
        users.splice(i, 1);
        return true;
      }
    });

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
            width="800" 
            height = "500"
            links={this.state.links}/>

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