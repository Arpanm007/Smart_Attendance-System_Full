const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Database Connection
connectDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/subjects', require('./routes/subjectRoutes'));


app.get('/', (req, res) => {
    res.send('Smart Attendance Management System API is running...');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('join', (classId) => {
        socket.join(classId);
        console.log(`Teacher joined class ${classId}`);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
