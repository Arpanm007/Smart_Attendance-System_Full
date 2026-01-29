const express = require('express');
const router = express.Router();
const { authUser, registerUser } = require('../controllers/authController');
const getInfo = require('../controllers/getInfo');

router.post('/login', authUser);
router.post('/user/info', getInfo)
router.post('/register', registerUser);

module.exports = router;
