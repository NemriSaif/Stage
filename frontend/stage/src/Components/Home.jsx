import React from "react";
import { Link } from "react-router-dom";
import "./home.css"
//import logo from './logopfee.png'; 


const Home = () => {
  return (
    <>
      <section>
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {/* Existing code */}
      <ul>
        <li>Home</li>
      </ul>
      <div className="auth-links-container" style={{ display: 'flex', gap: '10px' }}>
        <button className="login-link">
          <Link to="/profile" style={{ textDecoration: 'none', color: '#11101d', transition: 'color 0.1s' }}
            onMouseOver={(e) => (e.target.style.color = 'white')} // Change color on hover
            onMouseOut={(e) => (e.target.style.color = '#11101d')} >Profile</Link>
        </button>
        
      </div>
    </header>
    {/* Rest of the code */}
  </section>
    </>
  );
};

export default Home;