const mongoose = require('mongoose');

// Course Schema
const CourseSchema = new mongoose.Schema({
    courseId: { type: Number, required: true, unique: true },
    title: String,
    fee: Number,
    level: Number,
    trackName: String,
    type: String,
});

// Export the Course model
module.exports = mongoose.model('Course', CourseSchema);
