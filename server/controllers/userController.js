const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Subject = require('../models/Subject');

const getStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).select('-password').sort({ studentId: 1 });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getDashboardStats = async (req, res) => {
    const { userId } = req.body;

    console.log(userId);
    try {
        const totalStudents = await User.countDocuments({ role: 'student' });

        const date = new Date();
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const subjects = await Subject.find({ teacherId: userId });

        console.log(subjects);

        const subAttDetails = await Promise.all(subjects.map(async (subject) => {
            const presentCount = await Attendance.countDocuments({
                date: { $gte: startOfDay, $lte: endOfDay },
                status: 'Present',
                subject: subject._id
            });

            const absentCount = await Attendance.countDocuments({
                date: { $gte: startOfDay, $lte: endOfDay },
                status: 'Absent',
                subject: subject._id
            });

            const totalCount = subject.students.length;

            const studentStatusToday = await Promise.all(subject.students.map(async (studentId) => {
                const attendance = await Attendance.findOne({
                    date: { $gte: startOfDay, $lte: endOfDay },
                    subject: subject._id,
                    student: studentId
                });
                return {
                    student: await User.findById(studentId).select('name'),
                    date: date,
                    status: attendance ? attendance.status : null
                };
            }));
            const studentAttendanceAll = await Attendance.find({
                subject: subject._id
            })

            const studentStatusAll = await Promise.all(studentAttendanceAll.map(async (attendance) => {
                return {
                    student: await User.findById(attendance.student).select('name'),
                    date: attendance.date,
                    status: attendance.status
                };
            }));

            return {
                subject: subject.name,
                subjectId: subject._id,
                presentToday: presentCount,
                absentToday: absentCount,
                totalStudents: totalCount,
                perStudentToday: studentStatusToday,
                perStudentAll: studentStatusAll
            };
        }));

        const presentToday = await Attendance.countDocuments({
            date: { $gte: startOfDay, $lte: endOfDay },
            status: 'Present'
        });

        const absentToday = await Attendance.countDocuments({
            date: { $gte: startOfDay, $lte: endOfDay },
            status: 'Absent'
        });

        res.json({
            subjectDetails: subAttDetails,
            totalStudents,
            presentToday,
            absentToday
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        if (req.body.phone && (req.body.phone.length !== 10 || !/^\d+$/.test(req.body.phone))) {
            res.status(400);
            throw new Error('Phone number must be exactly 10 digits');
        }

        if (req.body.password && req.body.password.length < 6) {
            res.status(400);
            throw new Error('Password must be at least 6 characters');
        }

        user.name = req.body.name || user.name;
        user.phone = req.body.phone || user.phone;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            phone: updatedUser.phone,
            studentId: updatedUser.studentId,
            course: updatedUser.course,
            token: req.headers.authorization.split(' ')[1]
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};

module.exports = { getStudents, getDashboardStats, updateUserProfile };
