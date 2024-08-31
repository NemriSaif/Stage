import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiEye, FiEdit, FiTrash2, FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight, FiSearch } from 'react-icons/fi';
import 'bootstrap/dist/css/bootstrap.min.css';

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(8);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchFields, setSearchFields] = useState({
    username: '',
    fullname: '',
    email: '',
    phoneNumber: '',
    birthDay: '',
    role: ''
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/users');
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const results = users.filter(user =>
      user.username.toLowerCase().includes(searchFields.username.toLowerCase()) &&
      user.fullname.toLowerCase().includes(searchFields.fullname.toLowerCase()) &&
      user.email.toLowerCase().includes(searchFields.email.toLowerCase()) &&
      user.phoneNumber.toLowerCase().includes(searchFields.phoneNumber.toLowerCase()) &&
      (user.birthDay && new Date(user.birthDay).toLocaleDateString().includes(searchFields.birthDay.toLowerCase())) &&
      user.role.toLowerCase().includes(searchFields.role.toLowerCase())
    );
    setFilteredUsers(results);
    setCurrentPage(1);
  }, [searchFields, users]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const pageNumbers = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < pageNumbers) {
      setCurrentPage(prevPage => prevPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    } else if (direction === 'first') {
      setCurrentPage(1);
    } else if (direction === 'last') {
      setCurrentPage(pageNumbers);
    }
  };

  const handleViewClick = (user) => {
    setViewingUser(user);
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/users/${userToDelete._id}`);
      const updatedUsers = users.filter(user => user._id !== userToDelete._id);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setUserToDelete(null); // Close the confirmation modal
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingUser({ ...editingUser, [name]: value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/users/${editingUser._id}`, editingUser);
      const updatedUsers = users.map(user => user._id === editingUser._id ? editingUser : user);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchFields({ ...searchFields, [name]: value });
  };

  const closeModal = () => {
    setEditingUser(null);
    setViewingUser(null);
    setUserToDelete(null); // Close the confirmation modal
    setSearchVisible(false); // Close the search popout
  };

  // Calculate user range display
  const startUserIndex = indexOfFirstUser + 1;
  const endUserIndex = Math.min(indexOfLastUser, filteredUsers.length);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-outline-secondary" onClick={() => setSearchVisible(true)}>
          <FiSearch />
        </button>
        <span className="text-muted">{`${startUserIndex} - ${endUserIndex} / ${filteredUsers.length}`}</span>
      </div>

      <table className="table table-hover">
        <thead>
          <tr>
            <th>Username</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Birthday</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map(user => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.fullname}</td>
              <td>{user.email}</td>
              <td>{user.phoneNumber}</td>
              <td>{new Date(user.birthDay).toLocaleDateString()}</td>
              <td>{user.role}</td>
              <td className="d-flex">
                <button className="btn btn-sm btn-outline-primary me-2" title="View" onClick={() => handleViewClick(user)}>
                  <FiEye />
                </button>
                <button className="btn btn-sm btn-outline-secondary me-2" title="Edit" onClick={() => handleEditClick(user)}>
                  <FiEdit />
                </button>
                <button className="btn btn-sm btn-outline-danger" title="Delete" onClick={() => handleDeleteClick(user)}>
                  <FiTrash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-center">
        <button className="btn btn-outline-secondary me-2" onClick={() => handlePageChange('first')} disabled={currentPage === 1}>
          <FiChevronsLeft />
        </button>
        <button className="btn btn-outline-secondary me-2" onClick={() => handlePageChange('prev')} disabled={currentPage === 1}>
          <FiChevronLeft />
        </button>
        <span className="text-muted me-2">{`${currentPage} / ${pageNumbers}`}</span>
        <button className="btn btn-outline-secondary me-2" onClick={() => handlePageChange('next')} disabled={currentPage === pageNumbers}>
          <FiChevronRight />
        </button>
        <button className="btn btn-outline-secondary" onClick={() => handlePageChange('last')} disabled={currentPage === pageNumbers}>
          <FiChevronsRight />
        </button>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeModal}></button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={editingUser.username}
                      className="form-control"
                      onChange={handleEditChange}
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="fullname"
                      value={editingUser.fullname}
                      className="form-control"
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editingUser.email}
                      className="form-control"
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={editingUser.phoneNumber}
                      className="form-control"
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Birthday</label>
                    <input
                      type="date"
                      name="birthDay"
                      value={new Date(editingUser.birthDay).toISOString().substring(0, 10)}
                      className="form-control"
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <input
                      type="text"
                      name="role"
                      value={editingUser.role}
                      className="form-control"
                      onChange={handleEditChange}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">Save</button>
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewingUser && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">User Details</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <p><strong>Username:</strong> {viewingUser.username}</p>
                <p><strong>Full Name:</strong> {viewingUser.fullname}</p>
                <p><strong>Email:</strong> {viewingUser.email}</p>
                <p><strong>Phone Number:</strong> {viewingUser.phoneNumber}</p>
                <p><strong>Birthday:</strong> {new Date(viewingUser.birthDay).toLocaleDateString()}</p>
                <p><strong>Role:</strong> {viewingUser.role}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this user?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger" onClick={confirmDelete}>Delete</button>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Popout */}
      {searchVisible && (
        <div className="offcanvas offcanvas-end show" style={{ visibility: 'visible', width: '300px' }}>
          <div className="offcanvas-header">
            <h5 className="offcanvas-title">Search Users</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={closeModal}></button>
          </div>
          <div className="offcanvas-body">
            <form>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  name="username"
                  value={searchFields.username}
                  className="form-control"
                  onChange={handleSearchChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="fullname"
                  value={searchFields.fullname}
                  className="form-control"
                  onChange={handleSearchChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="text"
                  name="email"
                  value={searchFields.email}
                  className="form-control"
                  onChange={handleSearchChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={searchFields.phoneNumber}
                  className="form-control"
                  onChange={handleSearchChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Birthday</label>
                <input
                  type="text"
                  name="birthDay"
                  value={searchFields.birthDay}
                  className="form-control"
                  onChange={handleSearchChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Role</label>
                <input
                  type="text"
                  name="role"
                  value={searchFields.role}
                  className="form-control"
                  onChange={handleSearchChange}
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
