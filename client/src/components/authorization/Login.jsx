import React, { useState } from 'react';
import './authorization.css';
import Input from "../../utils/input/Input";
import { useDispatch } from "react-redux";
import { login } from "../../actions/user";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  return (
    <div className='authorization'>
      <div className="authorization__header">Login</div>
      <Input
        type="text"
        placeholder="email"
        value={email}
        setValue={setEmail}
        defaultValue={email}
      />
      <Input
        type="password"
        placeholder="password"
        value={password}
        setValue={setPassword}
        defaultValue={password}
      />
      <button
        className="authorization__btn"
        onClick={() => dispatch(login(email, password))}
      >
        Sign In
      </button>
    </div>
  );
};

export default Login;
