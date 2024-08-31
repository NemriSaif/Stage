import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import 'bootstrap/dist/css/bootstrap.min.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:3001/profile', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUserData(response.data);
        } catch (error) {
          console.error('Error fetching profile data', error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmChange = (e) => {
    setConfirmText(e.target.value);
  };

  const handleConfirmDelete = () => {
    if (confirmText === "i confirm") {
      axios.delete('http://localhost:3001/delete-account', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then(() => {
        localStorage.removeItem("token");
        window.location.href = '/';
      })
      .catch(err => {
        console.error("Error deleting account", err);
      });
    } else {
      alert("Please type 'i confirm' to proceed.");
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  const handleEditClick = () => {
    navigate('/edit');
  };

  if (!userData) {
    return <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>;
  }

  return (
    <main className="content">
      <div className="container-fluid p-0">
        <h1 className="h3 mb-3">Profile</h1>
        <div className="row">
          <div className="col-md-4 col-xl-3">
            <div className="card mb-3">
              <div className="card-header">
                <h5 className="card-title mb-0">Profile Details</h5>
              </div>
              <div className="card-body text-center">
                <img src={userData.profilePic || '/images/profile-pic.png'} alt="Profile" className="img-fluid rounded-circle mb-2" width="128" height="128" />
                <h5 className="card-title mb-0">{userData.fullname}</h5>
                <div className="text-muted mb-2">@{userData.username}</div>
                <div>
                  <button className="btn btn-primary btn-sm me-2" onClick={handleEditClick}>
                    <FiEdit className="feather me-1" /> Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={handleDeleteClick}>
                    <FiTrash2 className="feather me-1" /> Delete
                  </button>
                </div>
              </div>
              <hr className="my-0" />
              <div className="card-body">
                <h5 className="h6 card-title">About</h5>
                <ul className="list-unstyled mb-0">
                  <li className="mb-1"><span className="text-muted">Email: </span>{userData.email}</li>
                  <li className="mb-1"><span className="text-muted">Phone: </span>{userData.phoneNumber}</li>
                  <li className="mb-1"><span className="text-muted">Role: </span>{userData.role}</li>
                  <li className="mb-1"><span className="text-muted">Birthday: </span>{new Date(userData.birthDay).toLocaleDateString()}</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-8 col-xl-9">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Activities</h5>
              </div>
              <div className="card-body h-100">
                {/* You can add user activities or other relevant information here */}
                <p>No recent activities.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Account Deletion</h5>
                <button type="button" className="btn-close" onClick={handleCancel} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                <p>Type 'i confirm' to completely delete your account:</p>
                <input 
                  type="text" 
                  className="form-control"
                  value={confirmText} 
                  onChange={handleConfirmChange} 
                  placeholder="Type 'i confirm'" 
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>Delete Account</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Profile;