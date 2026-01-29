const UserModal = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password } = req.body; // 'email' field acts as Identifier (Email or Student ID)
    console.log(email, password);

    try {
        // Allow login with either Email OR Student ID
        const user = await UserModal.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                token: generateToken(user._id),
                role: user.role,
            });
        } else {
            res.status(401).json({ message: 'Invalid Student ID/Email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, phone, password, role, studentId, course } = req.body;

    try {
        const userExists = await UserModal.findOne({ email });

        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        if (role === 'student') {
            if (!studentId) {
                return res.status(400).json({ message: 'Student ID is required' });
            }
            const idExists = await UserModal.findOne({ studentId });
            if (idExists) {
                res.status(400).json({ message: 'Student ID already taken' });
                return;
            }
        } else {
            // For teachers, ensure studentId is undefined so sparse index ignores it
            req.body.studentId = undefined;
        }

        const user = await UserModal.create({
            name,
            email,
            phone,
            password,
            role,
            studentId: role === 'student' ? studentId : undefined,
            course: role === 'student' ? null : undefined
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                studentId: user.studentId,
                course: user.course,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error(error);
    }
};

module.exports = { authUser, registerUser };
