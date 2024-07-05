import React, { useState } from 'react';
import './signIn.css'; 
import { Link } from 'react-router-dom';

 function Login() {
  return (
    <div className="login-container">
      <div className="card-containerL">
        <div className="left-panelL">
          <h2 className="headingL">Connect to</h2>
          <p className="subheadingL">your account</p>
        </div>
        <div className="right-panelL">
          <div >

            <h2 >Welcome</h2>
            <div >
              <span>Don't have an account ? </span>
              <Link to="/register" style={{ textDecoration: 'none' }}>
              Register
              </Link>
            </div>
          </div>
          <h1 className="headingL">Login </h1>



          <form  className="form-groupL">
            <div className="form-groupL">
              <label className="form-labelL" htmlFor="username">
              Enter your email adress
              </label>
              <input
                className="form-inputL"
                id="username"
                placeholder="Email adress"
                type="text"

              />
            </div>
            <div className="form-groupL">
              <label className="form-labelL" htmlFor="password">
              Enter your password
              </label>
              <input
                className="form-inputL"
                id="password"
                placeholder="Password"
                type="password"

              />
            </div>
            <div >
            <div>
              <Link to="/Home" className="sign-in-btnL">
                Connect
              </Link>
            </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Login;