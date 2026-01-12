const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const [users] = await pool.query(
      `SELECT u.id, u.email, u.name, u.is_admin, u.created_at, 
              p.points, p.total_standups, p.streak_days
       FROM users u
       LEFT JOIN points p ON u.id = p.user_id
       ORDER BY u.created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const [countResult] = await pool.query(
      'SELECT COUNT(*) as total FROM users'
    );
    const total = countResult[0].total;

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update user (admin only)
exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, is_admin } = req.body;

    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (email !== undefined) {
      updates.push('email = ?');
      values.push(email);
    }
    if (is_admin !== undefined) {
      updates.push('is_admin = ?');
      values.push(is_admin);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(userId);

    await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Prevent deleting yourself
    if (parseInt(userId) === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    await pool.query('DELETE FROM users WHERE id = ?', [userId]);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update user points (admin only)
exports.updateUserPoints = async (req, res) => {
  try {
    const { userId } = req.params;
    const { points, adjustment_type } = req.body;

    if (!points || !adjustment_type) {
      return res.status(400).json({ error: 'Points and adjustment_type are required' });
    }

    let query;
    if (adjustment_type === 'add') {
      query = 'UPDATE points SET points = points + ? WHERE user_id = ?';
    } else if (adjustment_type === 'subtract') {
      query = 'UPDATE points SET points = GREATEST(points - ?, 0) WHERE user_id = ?';
    } else if (adjustment_type === 'set') {
      query = 'UPDATE points SET points = ? WHERE user_id = ?';
    } else {
      return res.status(400).json({ error: 'Invalid adjustment_type' });
    }

    await pool.query(query, [points, userId]);

    res.json({ message: 'Points updated successfully' });
  } catch (error) {
    console.error('Update user points error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get statistics (admin only)
exports.getStatistics = async (req, res) => {
  try {
    const [totalUsers] = await pool.query(
      'SELECT COUNT(*) as count FROM users WHERE is_admin = FALSE'
    );

    const [totalStandups] = await pool.query(
      'SELECT COUNT(*) as count FROM standup_history'
    );

    const [totalPoints] = await pool.query(
      'SELECT SUM(points) as total FROM points'
    );

    const [activeToday] = await pool.query(
      'SELECT COUNT(DISTINCT user_id) as count FROM standup_history WHERE DATE(completed_at) = CURDATE()'
    );

    res.json({
      statistics: {
        total_users: totalUsers[0].count,
        total_standups: totalStandups[0].count,
        total_points_awarded: totalPoints[0].total || 0,
        active_users_today: activeToday[0].count
      }
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
