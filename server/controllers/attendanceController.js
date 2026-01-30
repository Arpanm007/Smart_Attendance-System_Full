const Attendance = require('../models/Attendance');
const User = require('../models/User');

const markAttendance = async (req, res) => {
    const { studentId, date, classId, status } = req.body;
    console.log(req.body);

    if (!classId) {
        res.status(400).json({ message: 'Class is required' });
        return;
    }

    const attendanceDate = new Date(date || Date.now());
    attendanceDate.setHours(0, 0, 0, 0);

    console.log("Attendance Date:", attendanceDate);

    try {
        const existingRecord = await Attendance.findOne({
            student: studentId,
            class: classId,
            date: attendanceDate
        });

        if (existingRecord) {
            existingRecord.status = status;
            await existingRecord.save();
            res.json({ message: 'Attendance updated', data: existingRecord });
        } else {
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

const getMyAttendance = async (req, res) => {
    const attendance = await Attendance.find({ student: req.user._id })
        .populate('subject', 'name code')
        .sort({ date: -1 });
    res.json(attendance);
};

const getAttendanceReport = async (req, res) => {
    const attendance = await Attendance.find({})
        .populate('student', 'name email studentId course')
        .populate('subject', 'name code')
        .sort({ date: -1 });

    res.json(attendance);
};

module.exports = { markAttendance, markBulkAttendance, getMyAttendance, getAttendanceReport };
