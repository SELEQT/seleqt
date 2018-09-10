import React from 'react';
import Menu from "react-burger-menu/lib/menus/slide";

export default props => {
  return (
    <Menu right>
      <a className="menu-item" href="#">
        Home
      </a>

      <a className="menu-item" href="#">
        About
      </a>

      <a className="menu-item" href="#">
        Profile
      </a>

      <a className="menu-item" href="/">
        Enter new SELEQT code
      </a>
    </Menu>
  );
};