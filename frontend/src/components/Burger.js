import React from 'react';
import Menu from "react-burger-menu/lib/menus/slide";


class Burger extends React.Component{

  play = () => {
    if (!this.props.playing)
      this.props.playPlayList();
  }

  render(){
  return (
    <div className="menuFlex">


      {/* <div className="logoFlexContainer">

      </div> */}

      <div className="menu">
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

          <p className="menu-item" href="#" onClick={() => this.play()}>
            Initiate
          </p>

          <p className="menu-item" href="#" onClick={() => this.props.shutDown()}>
            Shut down
          </p>

        </Menu>
      </div>
    </div>
  );
}}
export default Burger;