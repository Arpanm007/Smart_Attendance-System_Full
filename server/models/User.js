const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String, // 10 digit number
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['student', 'teacher'],
        default: 'student',
    },
    studentId: {
        type: String,
        unique: true,
        sparse: true, // Only for students
    },
    teacherId: {
        type: String,
        unique: true,
        sparse: true, // Only for teachers
    },
    subjects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject',
        },
    ],
    course: {
        type: String,
    }
}, {
    timestamps: true,
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
