import React from 'react';
import './profile.css';

const Profile = ({ username, email, fullname, birthDay, phoneNumber, role }) => {
  return (
    <section>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <ul>
          <li>Profile</li>
        </ul>
      </header>
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-pic">
            <img src="/images/profile-pic.png" alt="Profile" />
          </div>
          <div className="profile-info">
            <h1>{fullname}Saif NEMRI, 22</h1>
            <p>{username}</p>
            <p>@Nemri02</p>
            <p>{email}</p>
            <p>saifnemri2k21@gmail.com</p>
            <p>{role}</p>
            <p>13/03/2002</p>
            <p>{role}</p>
            <p>Administrator</p>
            <p>{phoneNumber}</p>
            <p>50229196</p>
          </div>
        </div>
        <div className="profile-actions">
          <button className="connect-btn">Edit</button>
          <button className="message-btn">Delete</button>
        </div>
      </div>
    </section>
  );
};

export default Profile;