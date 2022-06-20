import React, { useState } from 'react';
import './registration.css';
import Input from "../../utils/input/Input";

const Registration = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className='registration'>
      <div className="registration__header">Registration</div>
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
      <button className="registration__btn">Sign In</button>
    </div>
  );
};

export default Registration;
