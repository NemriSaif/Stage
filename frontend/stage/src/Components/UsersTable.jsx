import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './usersTable.css';

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(8); // Number of users per page
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/users');
        setUsers(response.data);
        setFilteredUsers(response.data); // Initialize filtered users
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const results = users.filter(user =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.birthDay && new Date(user.birthDay).toLocaleDateString().includes(searchQuery.toLowerCase())) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(results);
    setCurrentPage(1); // Reset to first page on search
  }, [searchQuery, users]);

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

  return (
    <div className="table-wrapper">
      <table className="users-table">
        <thead>
          <tr>
            <th colSpan="6">
              <div className="table-controls">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-bar"
                />
              </div>
            </th>
          </tr>
          <tr>
            <th>Username</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Birthday</th>
            <th>Role</th>
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
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="6">
              <div className="pagination">
                <button onClick={() => handlePageChange('first')} disabled={currentPage === 1}>&lt;&lt;</button>
                <button onClick={() => handlePageChange('prev')} disabled={currentPage === 1}>&lt;</button>
                <span>{currentPage}</span>
                <button onClick={() => handlePageChange('next')} disabled={currentPage === pageNumbers}>&gt;</button>
                <button onClick={() => handlePageChange('last')} disabled={currentPage === pageNumbers}>&gt;&gt;</button>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default UsersTable;
