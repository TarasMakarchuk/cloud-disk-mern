import React, { useState } from 'react';
import './navbar.css';
import Logo from '../../assets/img/navbar_logo.svg';
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../reducers/userReducer";
import { getFiles, searchFiles } from "../../actions/file";
import { showLoader } from "../../reducers/appReducer";

const Navbar = () => {
  const isAuth = useSelector(state => state.user.isAuth);
  const currentDir = useSelector(state => state.files.currentDir);
  const dispatch = useDispatch();
  const [searchName, setSearchName] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(false);

  const searchChangeHandler = event => {
    setSearchName(event.target.value);
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    dispatch(showLoader());
    if (event.target.value !== '') {
      setSearchTimeout(setTimeout(value => {
        dispatch(searchFiles(value));
      }, 500, event.target.value));
    } else {
      dispatch(getFiles(currentDir));
    }
  };

  return (
    <div className='navbar'>
      <div className="container hhh">
        <img src={Logo} alt="" className='navbar__logo'/>
        <div className="navbar__header">
          MERN CLOUD
        </div>
        {isAuth &&
        <input
          value={searchName}
          onChange={event => searchChangeHandler(event)}
          className='navbar__search'
          type="text"
          placeholder="Search file name..."
        />}
        {!isAuth &&
        <div className="navbar__login">
            <NavLink to='/login'>
              Sign In
            </NavLink>
          </div>}
        {!isAuth &&
        <div className="navbar__registration">
            <NavLink to='/registration'>
              Registration
            </NavLink>
          </div>}
        {isAuth &&
        <div className="navbar__login"
            onClick={() => dispatch(logout())}
          >
            Logout
          </div>}
      </div>
    </div>
  );
};

export default Navbar;
