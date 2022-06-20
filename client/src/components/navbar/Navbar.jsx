import React from 'react';
import './navbar.css';
import Logo from '../../assets/img/navbar_logo.svg';

const Navbar = () => {
  return (
    <div className='navbar'>
      <div className="container hhh">
        <img src={Logo} alt="" className='navbar__logo'/>
        <div className="navbar__header">MERN CLOUD</div>
        <div className="navbar__login">Sign In</div>
        <div className="navbar__registration">Registration</div>
      </div>
    </div>
  );
};

export default Navbar;
