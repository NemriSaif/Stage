import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faIndustry,  faUser, faSignOut, faChevronDown, faChevronUp, faFile,faFileExport } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './sidebar.css'; // Import the CSS file
import axios from "axios";
//import logo from '../logopfee.png'; 


function Sidebar() {
  const [userData, setUserData] = useState({});
  const [showPublicationMenu, setShowPublicationMenu] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Added state for admin check

  useEffect(() => {
    axios.post('http://localhost:3001/sidebar', { token: localStorage.getItem("token") })
      .then(result => {
        setUserData(result.data.data);
        setIsAdmin(result.data.data.role === 'admin'); // Set isAdmin based on user role
      })
      .catch(err => console.log(err));
  }, []);

  const togglePublicationMenu = () => {
    setShowPublicationMenu(!showPublicationMenu);
  };

  const closeMenu = () => {
    setShowPublicationMenu(false);
  };
  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');
    // Redirect or perform any other logout-related actions
    // For example, redirecting to the login page
    window.location.href = '/'; // Redirect to the login page
  };

  return (
    <nav className="sidebar-container">
      <div className="sidebar-logo-container">
        <img src={logo} alt="Logo" className="sidebar-logo" />
        </div>
      
      <div className="sidebar-menu">
        <Link to="/profile" className="sidebar-menu-item">
          <FontAwesomeIcon icon={faUserCircle} className="icon" />
          <span className="text">Profil</span>
        </Link>
        <div className="sidebar-menu-item" onClick={togglePublicationMenu}>
          <FontAwesomeIcon icon={faIndustry} className="icon" />
          <span className="text">Publication</span>
          <FontAwesomeIcon icon={showPublicationMenu ? faChevronUp : faChevronDown} className="arrow" />
        </div>
        {showPublicationMenu && (
          <ul className="sub-menu">
            <li onClick={closeMenu}>
              <Link to="/RS" className="link_name">
                <FontAwesomeIcon icon={faFile} className="iconF" />
                Revues Scientifiques
              </Link>
            </li>
            <li onClick={closeMenu}>
              <Link to="/conference" className="link_name">
                <FontAwesomeIcon icon={faFile} className="iconF" />
                Conférences
              </Link>
            </li>
            <li onClick={closeMenu}>
              <Link to="/chapitre" className="link_name">
                <FontAwesomeIcon icon={faFile} className="iconF" />
                Chapitre d'Ouvrages
              </Link>
            </li>
          </ul>
        )}
        <Link to="/demand" className="sidebar-menu-item">
          <FontAwesomeIcon icon={faFileExport} className="icon" />
          <span className="text">Demande</span>
        </Link>
       
        {isAdmin && ( // Render Manage Users only for admin
          <Link to="/manage" className="sidebar-menu-item">
            <FontAwesomeIcon icon={faUser} className="icon" />
            <span className="text">Gérer les utilisateurs</span>
          </Link>
        )}
      </div>
      <div className="sidebar-bottom">
  <Link to="" className="sidebar-menu-item sidebar-menu-item-last" onClick={handleLogout}>
    <FontAwesomeIcon icon={faSignOut} className="icon" />
    <div className="user-details">
      <span className="user-name">{userData.name}</span>
      <span className="user-role">{userData.role}</span>
    </div>
  </Link>
</div>

    </nav>
  );
}

export default Sidebar;