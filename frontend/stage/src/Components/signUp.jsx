import React from 'react';
import './signUp.css';
import Reactt, { useState } from 'react';


const SignUp = () => {
    return (
            <div className="signup-containerR">
          <div className="card-containerR">
            <div className="left-panelL">
              <h2 className="headingL">Create your account</h2>
              <p className="subheadingL"></p>
            </div>
            <div className="right-panelR">
              <h1 className="headingR">Signup</h1>
              <form  className="form-groupR">
                <div className="form-groupR">
                  <label className="form-labelR" htmlFor="Username">
                  Enter your Username
                  </label>
                  <input
                    className="form-inputR"
                    id="Username"
                    placeholder="Username"
                    type="username"
                   
                  />
                </div>
             
                <div className="form-groupR">
                  <label className="form-labelR" htmlFor="email">
                  Enter your email adress
                  </label>
                  <input
                    className="form-inputR"
                    id="email"
                    placeholder="Email adress"
                    type="email"
                   
                  />
                </div>
                <div className="form-groupR">
                  <label className="form-labelR" htmlFor="firstName">
                  Enter your Full Name
                  </label>
                  <input
                    className="form-inputR"
                    id="firstlastName"
                    placeholder="Full Name"
                    type="text"
                   
                  />
                </div>
               
                <div className="form-groupR">
                  <label className="form-labelR" htmlFor="PhoneNumber">
                  Enter your Phone Number
                  </label>
                  <input
                    className="form-inputR"
                    id="PhoneNumber"
                    placeholder="Phone Number"
                    type="text"
                   
                  />
                </div>
                <div className="form-groupR">
                  <label className="form-labelR" htmlFor="password">
                  Enter your Password
                  </label>
                  <input
                    className="form-inputR"
                    id="password"
                    placeholder="Password"
                    type="password"
                  
                  />
                </div>
                <div className="form-groupR">
                  <label className="form-labelR">Enter your Birthday</label>
                  <div className="birthday-select-group">
                    <select className="form-selectR" id="birthDay">
                      <option value="">Day</option>
                      {/* Generate day options */}
                      {[...Array(31).keys()].map(day => (
                      <option key={day} value={day + 1}>{day + 1}</option>
                      ))}
                    </select>
                    <select className="form-selectR" id="birthMonth">
                      <option value="">Month</option>
                      {/* List of months */}
                      {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, index) => (
                        <option key={index} value={index + 1}>{month}</option>
                      ))}
                    </select>
                    <select className="form-selectR" id="birthYear">
                      <option value="">Year</option>
                      {/* Generate year options */}
                      {[...Array(100).keys()].map(year => (
                        <option key={year} value={new Date().getFullYear() - year}>{new Date().getFullYear() - year}</option>
                      ))}
                    </select>
                  </div>
                </div>
              
                <div className="form-groupR">
                  <label className="form-labelR" htmlFor="role">
                  Signup as :
                  </label>
                  <select
                    className="form-inputR"
                    id="role"
                   
                  >
                     <option value="">Select your role</option>
                    <option value="Professeur">Adminstrator</option>
                    <option value="Master">Responsable</option>
                  </select>
                </div>
               
                
                
                <button className="sign-up-btnR" type="submit">
                SignUp
                </button>
                
              </form>
            </div>
          </div>
        </div>
    );
}

export default SignUp;
