const mongoose = require('mongoose');

const attendanceSchema = mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: Date,
        required: true,
        // Store only the date part to ensure uniqueness per day
        set: (d) => {
            const date = new Date(d);
            date.setHours(0, 0, 0, 0);
            return date;
        }
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Late', 'Excused'], // Expanded status options
        required: true,
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true,
    }
}, {
    timestamps: true,
});

// Compound index to ensure a student can have only one attendance record per subject per day
attendanceSchema.index({ student: 1, date: 1, subject: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
