const Subject = require('../models/Subject');

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Private
const getSubjects = async (req, res) => {
    const subjects = await Subject.find({});
    res.json(subjects);
};

// @desc    Create a subject
// @route   POST /api/subjects
// @access  Private (Teacher)
const createSubject = async (req, res) => {
    const { name, code, description } = req.body;

    const subjectExists = await Subject.findOne({ code });

    if (subjectExists) {
        res.status(400);
        res.json({ message: 'Subject code already exists' });
        return;
    }

    const subject = await Subject.create({
        name,
        code,
        description,
    });

    if (subject) {
        res.status(201).json(subject);
    } else {
        res.status(400);
        res.json({ message: 'Invalid subject data' });
    }
};

module.exports = { getSubjects, createSubject };
