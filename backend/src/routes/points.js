const express = require('express');
const router = express.Router();
const pointsController = require('../controllers/pointsController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

router.post('/record', pointsController.recordStandup);
router.get('/me', pointsController.getPoints);
router.get('/leaderboard', pointsController.getLeaderboard);
router.get('/history', pointsController.getHistory);

module.exports = router;
