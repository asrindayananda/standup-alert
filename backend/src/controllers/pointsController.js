const { pool } = require('../config/database');

// Record a standup completion
exports.recordStandup = async (req, res) => {
  try {
    const userId = req.user.id;
    const pointsEarned = 10; // Base points per standup

    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Record standup in history
      await connection.query(
        'INSERT INTO standup_history (user_id, points_earned) VALUES (?, ?)',
        [userId, pointsEarned]
      );

      // Get current points record
      const [pointsRecord] = await connection.query(
        'SELECT points, total_standups, streak_days, last_standup_date FROM points WHERE user_id = ?',
        [userId]
      );

      if (pointsRecord.length === 0) {
        throw new Error('Points record not found');
      }

      const currentPoints = pointsRecord[0];
      const today = new Date().toISOString().split('T')[0];
      const lastStandupDate = currentPoints.last_standup_date
        ? new Date(currentPoints.last_standup_date).toISOString().split('T')[0]
        : null;

      // Calculate streak
      let newStreak = currentPoints.streak_days;
      if (lastStandupDate) {
        const daysDiff = Math.floor(
          (new Date(today) - new Date(lastStandupDate)) / (1000 * 60 * 60 * 24)
        );
        
        if (daysDiff === 1) {
          newStreak += 1; // Continue streak
        } else if (daysDiff > 1) {
          newStreak = 1; // Reset streak
        }
        // If same day, keep current streak
      } else {
        newStreak = 1; // First standup
      }

      // Bonus points for streak
      const streakBonus = Math.floor(newStreak / 7) * 5; // 5 bonus points per week streak
      const totalPointsEarned = pointsEarned + streakBonus;

      // Update points
      await connection.query(
        'UPDATE points SET points = points + ?, total_standups = total_standups + 1, streak_days = ?, last_standup_date = ? WHERE user_id = ?',
        [totalPointsEarned, newStreak, today, userId]
      );

      await connection.commit();
      connection.release();

      res.json({
        message: 'Standup recorded successfully',
        points_earned: totalPointsEarned,
        streak_days: newStreak,
        streak_bonus: streakBonus
      });
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Record standup error:', error);
    res.status(500).json({ error: 'Server error recording standup' });
  }
};

// Get user points and stats
exports.getPoints = async (req, res) => {
  try {
    const userId = req.user.id;

    const [results] = await pool.query(
      'SELECT points, total_standups, streak_days, last_standup_date FROM points WHERE user_id = ?',
      [userId]
    );

    if (results.length === 0) {
      return res.status(404).json({ error: 'Points record not found' });
    }

    res.json(results[0]);
  } catch (error) {
    console.error('Get points error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;

    const [results] = await pool.query(
      `SELECT u.id, u.name, u.email, p.points, p.total_standups, p.streak_days 
       FROM users u 
       INNER JOIN points p ON u.id = p.user_id 
       WHERE u.is_admin = FALSE
       ORDER BY p.points DESC 
       LIMIT ?`,
      [limit]
    );

    res.json({ leaderboard: results });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get standup history
exports.getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 30;

    const [results] = await pool.query(
      'SELECT id, completed_at, points_earned FROM standup_history WHERE user_id = ? ORDER BY completed_at DESC LIMIT ?',
      [userId, limit]
    );

    res.json({ history: results });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
