import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import StatCard from '../components/StatCard';
import '../styles/Dashboard.css';

interface Statistics {
  total_users: number;
  total_standups: number;
  total_points_awarded: number;
  active_users_today: number;
}

const Dashboard: React.FC = () => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await adminAPI.getStatistics();
      setStatistics(response.data.statistics);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>📊 Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>

      <div className="stats-grid">
        <StatCard
          title="Total Users"
          value={statistics?.total_users || 0}
          icon="👥"
        />
        <StatCard
          title="Total Standups"
          value={statistics?.total_standups || 0}
          icon="🚶"
        />
        <StatCard
          title="Points Awarded"
          value={statistics?.total_points_awarded || 0}
          icon="⭐"
        />
        <StatCard
          title="Active Today"
          value={statistics?.active_users_today || 0}
          icon="✅"
        />
      </div>

      <div className="dashboard-actions">
        <button
          className="action-button"
          onClick={() => navigate('/users')}
        >
          👤 Manage Users
        </button>
        <button
          className="action-button"
          onClick={() => window.location.reload()}
        >
          🔄 Refresh Data
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
