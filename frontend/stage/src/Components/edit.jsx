import React from 'react';
import './edit.css';

const Edit = () => {
    return (
<section>
      <header>
        <ul>
          <li>Profile</li>
        </ul>
      </header>
            <div className="edit-profile-container">
                <div className="edit-form-container">
                    <h2>General Information</h2>
                    <form>
                        <div className="edit-form-group">
                            <label>Username</label>
                            <input type="text" placeholder="Enter your username" />
                        </div>
                        <div className="edit-form-group">
                            <label>Email</label>
                            <input type="email" placeholder="Enter your email" />
                        </div>
                        <div className="edit-form-group">
                            <label>Full Name</label>
                            <input type="text" placeholder="Enter your full name" />
                        </div>
                        <div className="edit-form-group">
                            <label>Birthday</label>
                            <input type="date" />
                        </div>
                        <div className="edit-form-group">
                            <label>Phone Number</label>
                            <input type="tel" placeholder="Enter your phone number" />
                        </div>
                        <div className="edit-form-group">
                            <label>Role</label>
                            <input type="text" placeholder="Enter your role" />
                        </div>
                        <button type="submit">Save All</button>
                    </form>
                </div>
                <div className="edit-profile-card">
                    <img src="/images/profile-pic.png" alt="Profile" className="edit-profile-photo"/>
                    <h3>Saif NEMRI</h3>
                    <p>@Nemri02</p>
                    <p>saifnemri2k21@gmail.com</p>
                </div>
            </div>
        </section>
    );
};

export default Edit;
