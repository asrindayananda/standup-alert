import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import '../styles/Users.css';

interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  created_at: string;
  points: number;
  total_standups: number;
  streak_days: number;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await adminAPI.getUsers(page, 20);
      setUsers(response.data.users);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      return;
    }

    try {
      await adminAPI.deleteUser(userId);
      alert('User deleted successfully');
      fetchUsers();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to delete user');
    }
  };

  const handleAdjustPoints = async (userId: number, userName: string) => {
    const points = prompt(`Enter points adjustment for ${userName} (use + or -):`);
    if (!points) return;

    const amount = parseInt(points);
    if (isNaN(amount)) {
      alert('Invalid number');
      return;
    }

    try {
      await adminAPI.updateUserPoints(userId, {
        points: Math.abs(amount),
        adjustment_type: amount >= 0 ? 'add' : 'subtract',
      });
      alert('Points updated successfully');
      fetchUsers();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to update points');
    }
  };

  if (isLoading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="users-container">
      <header className="users-header">
        <h1>👥 User Management</h1>
        <button onClick={() => navigate('/dashboard')} className="back-button">
          ← Back to Dashboard
        </button>
      </header>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Points</th>
              <th>Standups</th>
              <th>Streak</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  {user.name}
                  {user.is_admin && <span className="admin-badge"> Admin</span>}
                </td>
                <td>{user.email}</td>
                <td>{user.points || 0}</td>
                <td>{user.total_standups || 0}</td>
                <td>{user.streak_days || 0} days</td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                  <button
                    className="action-btn points-btn"
                    onClick={() => handleAdjustPoints(user.id, user.name)}
                  >
                    ⭐ Points
                  </button>
                  {!user.is_admin && (
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDeleteUser(user.id, user.name)}
                    >
                      🗑️ Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="pagination-btn"
        >
          Previous
        </button>
        <span className="pagination-info">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="pagination-btn"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Users;
