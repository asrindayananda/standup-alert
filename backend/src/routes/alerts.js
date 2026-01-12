const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

router.get('/settings', alertController.getSettings);
router.put('/settings', alertController.updateSettings);

module.exports = router;
