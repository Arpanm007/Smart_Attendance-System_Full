const express = require('express');
const router = express.Router();
const { markAttendance, markBulkAttendance, getMyAttendance, getAttendanceReport } = require('../controllers/attendanceController');
const { protect, teacher, student } = require('../middleware/authMiddleware');

router.route('/').post(protect, teacher, markAttendance).get(protect, teacher, getAttendanceReport);
router.route('/join').post(markAttendance);
router.route('/my').get(protect, student, getMyAttendance);

module.exports = router;
