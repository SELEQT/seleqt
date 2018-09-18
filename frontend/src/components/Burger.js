import React from 'react';
import Menu from "react-burger-menu/lib/menus/slide";


class Burger extends React.Component{

  state = {
    currentDevice: "",
  }

  play = () => {
    if (!this.props.playing)
      this.props.playPlayList();
  }

  activeDevice = (currentDevice) => {
    this.setState({ currentDevice: currentDevice })
    this.props.activeDevice(currentDevice);    
  }

  render(){
    console.log(this.props.userId.email);
    let listOfDevices;
    if (this.props.devices.length !== 0) {
      let devices = this.props.devices.devices
      listOfDevices = devices.map(device => 
        <React.Fragment>
          {device.id === this.state.currentDevice 
          ? <p className="menu-item activeDevice" onClick={() => this.activeDevice(device.id)}>{device.name}</p>
          : <p className="menu-item" onClick={() => this.activeDevice(device.id)}>{device.name}</p>
          }
        
        </React.Fragment>
      )
    }
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

          { (this.props.userId.email == "theresesarlin@gmail.com" || this.props.userId.email == "marcus.mh93@gmail.com" || this.props.userId.email == "anton.bq@gmail.com") ?
            <React.Fragment>
              <p className="menu-item" href="#" onClick={() => this.play()}>
                Initiate
              </p>

              <p className="menu-item" href="#" onClick={() => this.props.shutDown()}>
                Shut down
              </p>
            </React.Fragment> 
            : <div></div>
          }
          <hr></hr>
          <h3>Devices</h3>
          {listOfDevices}

        </Menu>
      </div>
    </div>
  );
}}
export default Burger;