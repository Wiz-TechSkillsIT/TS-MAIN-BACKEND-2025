const express = require('express');
const router = express.Router();
const Course = require('../models/Course'); // Adjust the path as necessary
const authenticateJWT = require('../config/middleware.js');
const User = require('../models/User'); // Import Course model
const Enrollment = require('../models/Enrollment'); // Import Course model

const JWT_SECRET_KEY = '151183200722';

// POST API to create a new course
router.post('/add', async (req, res) => {
    try {
        const { title, fee, courseId, level, trackName, type,image } = req.body;

        // Create a new course instance
        const newCourse = new Course({
            title,
            fee,
            courseId,
            level,
            trackName,
            type,
            image
        });

        // Save the course to the database
        const savedCourse = await newCourse.save();

        // Send the response
        res.status(201).json({
            message: 'Course created successfully',
            data: savedCourse
        });
    } catch (error) {
        console.error('Error creating course:', error.message);
        res.status(500).json({ message: 'Error creating course', error: error.message });
    }
});


// API to Enroll User in a Course
router.post('/enroll', authenticateJWT, async (req, res) => {
    const { userEmail, courseId } = req.body;
    if (!userEmail || !courseId) {
        return res.status(400).json({ error: 'UserEmail and CourseId are required!' });
    }
    try {
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ error: 'User does not exist!' });
        }
        const course = await Course.findOne({ courseId });
        if (!course) {
            return res.status(404).json({ error: 'Course does not exist!' });
        }
        const existingEnrollment = await Enrollment.findOne({ userEmail, courseId });
        if (existingEnrollment) {
            return res.status(400).json({ error: 'User is already enrolled in this course!' });
        }
        const enrollment = new Enrollment({ userEmail, courseId });
        await enrollment.save();
        res.status(201).json({ message: 'User enrolled successfully!' });
    } catch (err) {
        res.status(500).json({ error: 'Server error!' });
    }
});

 // API to Get Enrolled Courses
router.get('/enrolledCourses/:userEmail', authenticateJWT, async (req, res) => {
    const { userEmail } = req.params;
    console.log(authenticateJWT)
    try {
        // Find enrollments directly based on the user's email
        const enrollments = await Enrollment.find({ userEmail });

        // If no enrollments are found, return an empty response
        if (!enrollments.length) {
            return res.status(200).json({ message: 'No enrolled courses found.', courses: [] });
        }

        // Extract course IDs from enrollments
        const courseIds = enrollments.map((enrollment) => enrollment.courseId);

        // Fetch the details of the courses
        const courses = await Course.find({ courseId: { $in: courseIds } });

        // Respond with the course details
        res.status(200).json({ message: 'Enrolled courses retrieved successfully!', courses });
    } catch (err) {
        console.error('Error fetching enrolled courses:', err.message);
        res.status(500).json({ error: 'An error occurred while fetching enrolled courses.' });
    }
});


// API to check if user is enrolled in the course 
router.get('/is-enroll/:userEmail/:courseId', authenticateJWT, async (req, res) => {
    const { userEmail } = req.params;
    const { courseId } = req.params;
    try{
        const enrollments = await Enrollment.find({ userEmail });
        const isEnrolled = enrollments.some(enrollment => enrollment.courseId === courseId);
        
        isEnrolled == true?
        res.status(200).json({ msg: 'Enrollment verified' }) :
        res.status(500).json({ error: 'You are not enrolled in this course.' })
    }
    catch(err){
        res.status(500).json({ error: 'You are not enrolled in this course.' });

    } 

});

module.exports = router;
