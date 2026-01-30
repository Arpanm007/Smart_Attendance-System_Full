const Attendance = require('../models/Attendance');
const User = require('../models/User');

const markAttendance = async (req, res) => {
    const { studentId, date, classId, status } = req.body;
    console.log(req.body);

    if (!classId) {
        res.status(400).json({ message: 'Class is required' });
        return;
    }

    // Normalize date to midnight to ensure consistency
    const attendanceDate = new Date(date || Date.now());
    attendanceDate.setHours(0, 0, 0, 0);

    console.log("Attendance Date:", attendanceDate);

    try {
        // Check if record exists
        const existingRecord = await Attendance.findOne({
            student: studentId,
            class: classId,
            date: attendanceDate
        });

        if (existingRecord) {
            // Update existing
            existingRecord.status = status;
            await existingRecord.save();
            res.json({ message: 'Attendance updated', data: existingRecord });
        } else {
            // Create new



            const attendance = await Attendance.create({
                student: await User.findById(studentId).select('name'),
                status,
                date: attendanceDate,
                subject: classId
            });

            req.io.emit('attendanceUpdate', attendance);
            res.status(201).json({ message: 'Attendance marked', data: attendance });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Error marking attendance', error: error.message });
    }
};

// @desc    Get attendance for logged in student
// @route   GET /api/attendance/my
// @access  Private (Student)
const getMyAttendance = async (req, res) => {
    const attendance = await Attendance.find({ student: req.user._id })
        .populate('subject', 'name code') // Populate subject details
        .sort({ date: -1 });
    res.json(attendance);
};

// @desc    Get all attendance (for reports)
// @route   GET /api/attendance
// @access  Private (Teacher)
const getAttendanceReport = async (req, res) => {
    const attendance = await Attendance.find({})
        .populate('student', 'name email studentId course') // Updated extra fields
        .populate('subject', 'name code')
        .sort({ date: -1 });

    res.json(attendance);
};

module.exports = { markAttendance, markBulkAttendance, getMyAttendance, getAttendanceReport };
