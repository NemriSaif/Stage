import './signIn.css'; 
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


 function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault()
    axios.post('http://localhost:3001/', {email, password})
    .then(result => 
      {console.log(result)
        if(result.data === "success"){
          console.log("success");
          navigate('/home')
        }
        else if (result.data === "incorrect password") {
          console.log("incorrect password");
        }
    })
    .catch(err => console.error)
  }
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



          <form  className="form-groupL" onSubmit={handleSubmit}>
            <div className="form-groupL">
              <label className="form-labelL" htmlFor="username">
              Enter your email adress or Username
              </label>
              <input
                className="form-inputL"
                id="username"
                placeholder="Email adress"
                type="text"
                onChange={(e) => setEmail(e.target.value)}

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
                onChange={(e) => setPassword(e.target.value)}

              />
            </div>
            <div >
            <div>
              <button className="sign-in-btnL" type='submit'>
                Connect
              </button>
            </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Login;