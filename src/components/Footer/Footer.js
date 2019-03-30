import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './Footer.css';

class Footer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <footer className="footer">
        <div className="footer">
          <p>&copy; {new Date().getFullYear()} Copyright: <a href="#home"> WalletRank </a></p>
        </div>
      </footer>
    );
  }
}

export default Footer;