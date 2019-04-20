import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'bulma/css/bulma.css';
import './WalletRank.css';
import UserGraph from './components/UserGraph/UserGraph.js';
import NavBar from './components/NavBar/NavBar.js';
import Footer from './components/Footer/Footer.js';
import Loader from 'react-loader-spinner';
import * as d3 from "d3";
import * as _ from "lodash";

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
    this.loadNewUser = this.loadNewUser.bind(this);
    this.loadUsersAndLinks = this.loadUsersAndLinks.bind(this);
    this.WIDTH = "600";
    this.HEIGHT = "800";
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
      var info = res[1];

      var new_user = {
        name: id,
        is_parent: true,
        rank: score.walletrank_score,
        address: info.address,
        balance: info.final_balance,
        first_seen_ts: info.first_seen_ts,
        num_inbound: info.nb_inbound_tx,
        num_outbound: info.nb_outbound_tx,
        received: info.total_received,
        sent: info.total_sent
      };
      if (_.has(this.state.users, id)) {
        new_user = _.merge(this.state.users[id], new_user);
      }
      state_users[id] = new_user;

      var neighbors = res[2]
      for (var i = 0; i < neighbors['in'].length; i++) {
        if (i >= 25) {
          break;
        }

        let in_id = neighbors['in'][i][0];
        if (_.has(this.state.users, in_id)) {
          continue;
        }
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

      for (var i = 0; i < neighbors['out'].length; i++) {
        if (i >= 25) {
          break;
        }

        let out_id = neighbors['out'][i][0];
        if (_.has(this.state.users, out_id)) {
          continue;
        }
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

      if (this.state.isMounted) {
        this.setState({
          users: {...this.state.users, ...state_users},
          links: [...this.state.links, ...state_links],
        });
        this.loaderEnd();
      }
    });
  }

  loadNewUser(id, is_parent) {
    this.setState({
      users: {},
      links: []
    })
    this.loadUsersAndLinks(id, is_parent);
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
    if (!this.state.isMounted) {
      this.loadNewUser(this.INITIAL_BAD_USER, true);
    }
    this.setState({
      isMounted: true
    });
  }

  componentWillUnmount() {
    this.state.isMounted = false;
  }

  render() {
    let loaders = this.state.loaders;
    return (
      <div className="WalletRank">
        <div className="container">
          <NavBar loadUser={this.loadNewUser.bind(this)}/>

          {loaders === 0 ? 
            <UserGraph 
            users={this.state.users}
            links={this.state.links}
            width={this.WIDTH}
            height = {this.HEIGHT}
            loadUser={this.loadUsersAndLinks.bind(this)} /> 
            :
            <div className="load" height={this.HEIGHT} width={this.WIDTH}>
              <div className="loading">
                <Loader
                  type="ThreeDots" 
                  width="100" 
                  height="100"
                  color="white"
                />
              </div>
            </div>
          }

          <Footer/>
        </div>
      </div>
    );
  }
}

export default WalletRank;