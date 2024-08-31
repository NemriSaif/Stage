import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiCamera, FiSave, FiLock } from 'react-icons/fi';
import 'bootstrap/dist/css/bootstrap.min.css';

const Edit = () => {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        fullname: '',
        birthDay: '',
        phoneNumber: '',
        role: '',
    });
    const [showPasswordPopup, setShowPasswordPopup] = useState(false);
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [profilePic, setProfilePic] = useState('/images/profile-pic.png');
    const [profilePicFile, setProfilePicFile] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3001/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data);
                setFormData({
                    username: response.data.username,
                    email: response.data.email,
                    fullname: response.data.fullname,
                    birthDay: response.data.birthDay.slice(0, 10),
                    phoneNumber: response.data.phoneNumber,
                    role: response.data.role,
                });
                setProfilePic(response.data.profilePic || '/images/profile-pic.png');
            } catch (error) {
                console.error('Error fetching user data', error);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        setHasChanges(
            Object.values(formData).some(value => value !== '') || profilePicFile !== null
        );
    }, [formData, profilePicFile]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value,
        });
    };

    const handleProfilePicChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                setProfilePic(reader.result);
                setProfilePicFile(file);
                try {
                    const token = localStorage.getItem('token');
                    const formDataToSend = new FormData();
                    formDataToSend.append('profilePic', file);

                    await axios.post('http://localhost:3001/upload-profile-pic', formDataToSend, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                } catch (error) {
                    console.error('Error updating profile picture', error);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:3001/profile', { ...formData, profilePic }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Profile updated successfully!');
            setHasChanges(false);
        } catch (error) {
            console.error('Error updating profile', error);
        }
    };

    const handlePasswordSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:3001/change-password', passwordData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Password updated successfully!');
            setShowPasswordPopup(false);
        } catch (error) {
            console.error('Error changing password', error);
        }
    };

    if (!user) return <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>;

    return (
        <main className="content">
            <div className="container-fluid p-0">
                <h1 className="h3 mb-3">Edit Profile</h1>
                <div className="row">
                    <div className="col-md-4 col-xl-3">
                        <div className="card mb-3">
                            <div className="card-header">
                                <h5 className="card-title mb-0">Profile Picture</h5>
                            </div>
                            <div className="card-body text-center">
                                <img src={profilePic} alt="Profile" className="img-fluid rounded-circle mb-2" width="128" height="128" />
                                <div className="mt-2">
                                    <label htmlFor="fileInput" className="btn btn-primary">
                                        <FiCamera className="feather me-1" /> Change Picture
                                    </label>
                                    <input
                                        type="file"
                                        id="fileInput"
                                        accept="image/*"
                                        onChange={handleProfilePicChange}
                                        style={{ display: 'none' }}
                                    />
                                </div>
                            </div>
                            <hr className="my-0" />
                            <div className="card-body">
                                <h5 className="h6 card-title">About</h5>
                                <ul className="list-unstyled mb-0">
                                    <li className="mb-1"><span className="text-muted">Username: </span>{formData.username}</li>
                                    <li className="mb-1"><span className="text-muted">Email: </span>{formData.email}</li>
                                    <li className="mb-1"><span className="text-muted">Phone: </span>{formData.phoneNumber}</li>
                                    <li className="mb-1"><span className="text-muted">Role: </span>{formData.role}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8 col-xl-9">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title mb-0">Edit Profile Information</h5>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Full Name</label>
                                        <input type="text" className="form-control" name="fullname" value={formData.fullname} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Phone Number</label>
                                        <input type="tel" className="form-control" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Birthday</label>
                                        <input type="date" className="form-control" name="birthDay" value={formData.birthDay} onChange={handleChange} />
                                    </div>
                                    <button type="submit" className="btn btn-primary" disabled={!hasChanges}>
                                        <FiSave className="feather me-1" /> Save Changes
                                    </button>
                                    <button type="button" className="btn btn-secondary ms-2" onClick={() => setShowPasswordPopup(true)}>
                                        <FiLock className="feather me-1" /> Change Password
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showPasswordPopup && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Change Password</h5>
                                <button type="button" className="btn-close" onClick={() => setShowPasswordPopup(false)} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Old Password</label>
                                    <input type="password" className="form-control" name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">New Password</label>
                                    <input type="password" className="form-control" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Confirm New Password</label>
                                    <input type="password" className="form-control" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowPasswordPopup(false)}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={handlePasswordSubmit}>Change Password</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Edit;