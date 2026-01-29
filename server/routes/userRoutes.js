const express = require('express');
const router = express.Router();
const { getStudents, getDashboardStats, updateUserProfile } = require('../controllers/userController');
const { protect, teacher } = require('../middleware/authMiddleware');

router.get('/students', protect, teacher, getStudents);
router.post('/stats', protect, teacher, getDashboardStats);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
