const express = require('express');
const router = express.Router();
const { getSubjects, createSubject } = require('../controllers/subjectController');
const { protect, teacher } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getSubjects)
    .post(protect, teacher, createSubject);

module.exports = router;
