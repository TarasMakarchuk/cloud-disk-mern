import React from 'react';
import './navbar.css';
import Logo from '../../assets/img/navbar_logo.svg';
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {logout} from "../../reducers/userReducer";

const Navbar = () => {
  const isAuth = useSelector(state => state.user.isAuth);
  const dispatch = useDispatch();

  return (
    <div className='navbar'>
      <div className="container hhh">
        <img src={Logo} alt="" className='navbar__logo'/>
        <div className="navbar__header">
          MERN CLOUD
        </div>
        {
          !isAuth && <div className="navbar__login">
            <NavLink to='/login'>
              Sign In
            </NavLink>
          </div>
        }
        {
          !isAuth && <div className="navbar__registration">
            <NavLink to='/registration'>
              Registration
            </NavLink>
          </div>
        }
        {
          isAuth && <div className="navbar__login" onClick={() => dispatch(logout())}>
            Logout
          </div>
        }
      </div>
    </div>
  );
};

export default Navbar;
