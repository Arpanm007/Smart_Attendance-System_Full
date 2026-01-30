const mongoose = require('mongoose');

const subjectSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
    },
    description: {
        type: String,
        required: false,
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    students: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
}, {
    timestamps: true,
});

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
