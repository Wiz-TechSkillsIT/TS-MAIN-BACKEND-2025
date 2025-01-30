const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('../models/User'); // Import User model
const router = express.Router();

// JWT secret key
const JWT_SECRET_KEY = '151183200722';

// Function to validate Google ID token
const validateGoogleToken = async (idToken) => {
    try {
        const response = await axios.get(
            `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
        );
        return response.data; // Returns token details if valid
    } catch (error) {
        console.error('Google token validation error:', error.message);
        throw new Error('Invalid Google token');
    }
};

// API to generate a token for the user
router.post('/login', async (req, res) => {
    const { idToken } = req.body; // Google ID token from the client
    if (!idToken) {
        return res.status(400).json({ error: 'Google ID token is required!' });
    }

    try {
        // Validate Google token
        const tokenDetails = await validateGoogleToken(idToken);

        const { email, given_name: fname, name, picture } = tokenDetails;

        // Check if the user exists in the database
        let user = await User.findOne({ email });
        if (!user) {
            // If user doesn't exist, create a new one
            user = new User({
                email,
                fname,
                name,
                picture,
            });
            await user.save();
        }

        // Generate a JWT token
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                fname: user.name,
            },
            JWT_SECRET_KEY,
            { expiresIn: '1h' } // Token expiration time
        );

        // Respond with the token
        res.status(200).json({
            message: 'Login successful!',
            token,
            user: {
                email: user.email,
                fname: user.name,
                picture: user.profileImage,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message || 'Server error!' });
    }
});

module.exports = router;
