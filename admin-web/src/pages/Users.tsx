import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import Modal from '../components/Modal';
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
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [pointsInput, setPointsInput] = useState('');
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'subtract' | 'set'>('add');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
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
      showMessage('error', 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await adminAPI.deleteUser(selectedUser.id);
      showMessage('success', 'User deleted successfully');
      setShowDeleteModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error: any) {
      showMessage('error', error.response?.data?.error || 'Failed to delete user');
    }
  };

  const handleAdjustPoints = async () => {
    if (!selectedUser || !pointsInput) return;

    const amount = parseInt(pointsInput);
    if (isNaN(amount) || amount < 0) {
      showMessage('error', 'Please enter a valid positive number');
      return;
    }

    try {
      await adminAPI.updateUserPoints(selectedUser.id, {
        points: amount,
        adjustment_type: adjustmentType,
      });
      showMessage('success', 'Points updated successfully');
      setShowPointsModal(false);
      setSelectedUser(null);
      setPointsInput('');
      fetchUsers();
    } catch (error: any) {
      showMessage('error', error.response?.data?.error || 'Failed to update points');
    }
  };

  const openPointsModal = (user: User) => {
    setSelectedUser(user);
    setPointsInput('');
    setAdjustmentType('add');
    setShowPointsModal(true);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
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

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

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
                    onClick={() => openPointsModal(user)}
                  >
                    ⭐ Points
                  </button>
                  {!user.is_admin && (
                    <button
                      className="action-btn delete-btn"
                      onClick={() => openDeleteModal(user)}
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

      {/* Points Adjustment Modal */}
      <Modal
        isOpen={showPointsModal}
        onClose={() => setShowPointsModal(false)}
        title={`Adjust Points for ${selectedUser?.name}`}
      >
        <div className="modal-form">
          <div className="form-group">
            <label>Adjustment Type:</label>
            <select
              value={adjustmentType}
              onChange={(e) => setAdjustmentType(e.target.value as any)}
              className="form-select"
            >
              <option value="add">Add Points</option>
              <option value="subtract">Subtract Points</option>
              <option value="set">Set Points</option>
            </select>
          </div>

          <div className="form-group">
            <label>Points Amount:</label>
            <input
              type="number"
              value={pointsInput}
              onChange={(e) => setPointsInput(e.target.value)}
              placeholder="Enter amount"
              className="form-input"
              min="0"
            />
          </div>

          <div className="form-group">
            <p className="current-points">
              Current Points: <strong>{selectedUser?.points || 0}</strong>
            </p>
          </div>

          <div className="modal-actions">
            <button
              onClick={() => setShowPointsModal(false)}
              className="btn-cancel"
            >
              Cancel
            </button>
            <button
              onClick={handleAdjustPoints}
              className="btn-confirm"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete User"
      >
        <div className="modal-form">
          <p className="warning-text">
            Are you sure you want to delete user <strong>{selectedUser?.name}</strong>?
            This action cannot be undone.
          </p>
          <div className="modal-actions">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="btn-cancel"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteUser}
              className="btn-confirm btn-danger"
            >
              Delete User
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Users;
