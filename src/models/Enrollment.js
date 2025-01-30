const mongoose = require('mongoose');

// Enrollment Schema
const EnrollmentSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    courseId: { type: String, required: true },
    enrollmentDate: { type: Date, default: Date.now },
    progress: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
});
const Enrollment = mongoose.model('Enrollment', EnrollmentSchema);

module.exports = Enrollment;
