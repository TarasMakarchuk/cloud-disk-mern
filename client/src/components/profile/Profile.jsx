import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import { deleteAvatar, uploadAvatar } from "../../actions/user";
import './profile.css';
import {NavLink} from "react-router-dom";
import back from '../../assets/img/back.svg';

const Profile = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(state => state.user.isAuth);

  const changeHandler = event => {
    console.log(event);
    const file = event.target.files[0];
    dispatch(uploadAvatar(file));
  };

  return (
    <div className='profile'>
      {isAuth && <NavLink to='/disk'>
        <img className='profile__back' src={back} alt=""/>
      </NavLink>
      }
        {/*<button className="disk__back" onClick={() => backHandler()}>Back</button>*/}
        <label htmlFor="profile__avatar-upload" className="profile__avatar-label">Upload avatar</label>
        <input
          className='profile__avatar-upload'
          id="profile__avatar-upload"
          accept="image/*"
          onChange={event => changeHandler(event)}
          type="file"
          placeholder="Upload avatar"
          multiple={false}
        />



      <button className='profile__delete' onClick={() => dispatch(deleteAvatar())}>Delete avatar</button>
    </div>
  );
};

export default Profile;
