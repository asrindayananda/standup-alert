const { pool } = require('../config/database');

// Get alert settings for user
exports.getSettings = async (req, res) => {
  try {
    const userId = req.user.id;

    const [results] = await pool.query(
      'SELECT * FROM alert_settings WHERE user_id = ?',
      [userId]
    );

    if (results.length === 0) {
      return res.status(404).json({ error: 'Settings not found' });
    }

    res.json({ settings: results[0] });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update alert settings
exports.updateSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { start_time, end_time, interval_minutes, enabled, days_of_week } = req.body;

    const updates = [];
    const values = [];

    if (start_time !== undefined) {
      updates.push('start_time = ?');
      values.push(start_time);
    }
    if (end_time !== undefined) {
      updates.push('end_time = ?');
      values.push(end_time);
    }
    if (interval_minutes !== undefined) {
      updates.push('interval_minutes = ?');
      values.push(interval_minutes);
    }
    if (enabled !== undefined) {
      updates.push('enabled = ?');
      values.push(enabled);
    }
    if (days_of_week !== undefined) {
      updates.push('days_of_week = ?');
      values.push(JSON.stringify(days_of_week));
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(userId);

    await pool.query(
      `UPDATE alert_settings SET ${updates.join(', ')} WHERE user_id = ?`,
      values
    );

    // Fetch updated settings
    const [results] = await pool.query(
      'SELECT * FROM alert_settings WHERE user_id = ?',
      [userId]
    );

    res.json({
      message: 'Settings updated successfully',
      settings: results[0]
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
