import React from 'react';
import { Link } from 'react-router-dom';
import {ReactComponent as TellorLogoWhite} from 'assets/tellorscan_white.svg';
import {ReactComponent as Swoosh} from 'assets/Swoosh.svg';

const Footer = () => {
  return (
    <div className="Footer">
      <div>
        <Link to="/">
          <Swoosh />
        </Link>
        <Link to="/">
          <TellorLogoWhite />
        </Link>
        <p>&copy; 2021 Tellor</p>
      </div>
      <div>
        <p>Links</p>
        <a href="http://tellor.io" alt="http://docs.tellor.io" target="_blank" rel="noopener noreferrer">tellor.io</a>
        <a href="http://docs.tellor.io" alt="http://docs.tellor.io" target="_blank" rel="noopener noreferrer">docs.tellor.io</a>
      </div>
    </div>
  );
};

export default Footer;
