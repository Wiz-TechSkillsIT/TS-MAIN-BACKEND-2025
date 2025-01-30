const express = require('express');
const router = express.Router();
const axios = require("axios");
const User = require('../models/User'); // Import Course model

// API to Add User
router.post('/addUser', async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and Email are required!' });
    }
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(201).json({ message: 'Welcome back!' });
            return; 
        }
        const user = new User({ name, email });
        await user.save();
        res.status(201).json({ message: 'User added successfully!' });
    } catch (err) {
        res.status(500).json({ error: 'Server error!' });
    }
});

module.exports = router;