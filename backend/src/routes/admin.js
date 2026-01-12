const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// All routes require authentication and admin privileges
router.use(authenticateToken);
router.use(requireAdmin);

router.get('/users', adminController.getAllUsers);
router.put('/users/:userId', adminController.updateUser);
router.delete('/users/:userId', adminController.deleteUser);
router.put('/users/:userId/points', adminController.updateUserPoints);
router.get('/statistics', adminController.getStatistics);

module.exports = router;
