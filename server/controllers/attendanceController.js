const Attendance = require('../models/Attendance');
const User = require('../models/User');

// @desc    Mark attendance (Upsert: Create or Update)
// @route   POST /api/attendance
// @access  Private (Teacher only)
// const markAttendance = async (req, res) => {
//     const { studentId, status, date, subjectId } = req.body;

//     if (!subjectId) {
//         res.status(400).json({ message: 'Subject is required' });
//         return;
//     }

//     // Normalize date to midnight to ensure consistency
//     const attendanceDate = new Date(date || Date.now());
//     attendanceDate.setHours(0, 0, 0, 0);

//     try {
//         // Check if record exists
//         const existingRecord = await Attendance.findOne({
//             student: studentId,
//             subject: subjectId,
//             date: attendanceDate
//         });

//         if (existingRecord) {
//             // Update existing
//             existingRecord.status = status;
//             await existingRecord.save();
//             res.json({ message: 'Attendance updated', data: existingRecord });
//         } else {
//             // Create new
//             const attendance = await Attendance.create({
//                 student: studentId,
//                 status,
//                 date: attendanceDate,
//                 subject: subjectId
//             });
//             res.status(201).json({ message: 'Attendance marked', data: attendance });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(400).json({ message: 'Error marking attendance', error: error.message });
//     }
// };

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

// @desc    Mark BULK attendance
// @route   POST /api/attendance/bulk
// @access  Private (Teacher only)
const markBulkAttendance = async (req, res) => {
    const { attendanceData, date, subjectId } = req.body;
    // attendanceData = [{ studentId: '123', status: 'Present' }, ...]

    if (!attendanceData || !Array.isArray(attendanceData) || !subjectId) {
        return res.status(400).json({ message: 'Invalid data format' });
    }

    const attendanceDate = new Date(date || Date.now());
    attendanceDate.setHours(0, 0, 0, 0);

    try {
        const operations = attendanceData.map(record => ({
            updateOne: {
                filter: {
                    student: record.studentId,
                    subject: subjectId,
                    date: attendanceDate
                },
                update: {
                    $set: { status: record.status }
                },
                upsert: true
            }
        }));

        await Attendance.bulkWrite(operations);
        res.json({ message: 'Bulk attendance marked successfully' });

    } catch (error) {
        console.error("Bulk write error:", error);
        res.status(500).json({ message: 'Failed to mark bulk attendance' });
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
