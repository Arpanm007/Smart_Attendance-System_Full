const UserModal = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const getInfo = async (req, res) => {
    const { userId } = req.body;
    console.log(userId);
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded.id);
        if (String(decoded.id) !== String(userId)) {
            return res.status(403).json({ message: 'Forbidden: Invalid token for user' });
        }
    }
    catch (err) {
        return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }

    try {
        const user = await UserModal.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = getInfo;
