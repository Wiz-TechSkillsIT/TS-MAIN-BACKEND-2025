const express = require('express');
const cors = require('cors');
const axios = require('axios');
const courseRoutes = require('./routes/course'); // Import course routes
const videoRoutes = require('./routes/video'); // Import video routes
const userRoutes = require('./routes/user'); 
const paymentRoutes = require('./routes/payment');
const authRoutes = require('./routes/auth');
const { dbConnect } = require('./config/db');

const app = express();

// Database connection
dbConnect();

// Middleware
app.use(express.json()); // Parse JSON body
app.use(cors()); // Handle CORS
app.options('*', cors()); // Handle preflight requests

// Test route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// VdoCipher API example
const API_SECRET_KEY = 'DJqUdCcTvILjOPhYSDHHE8WrY71IHSTzKpah8RK2q6qWGnSMXgLrN7Gm9BJ4yDRP';

app.post('/api/video/vdocipher/otp', async (req, res) => {
    const { code } = req.body;
    console.log('Incoming request with code:', code);

    if (!code) {
        console.error('Error: Missing video code');
        return res.status(400).json({ error: 'Video code is required' });
    }

    try {
        const response = await axios.post(
            `https://dev.vdocipher.com/api/videos/${code}/otp`,
            { ttl: 300 },
            {
                headers: {
                    Authorization: `Apisecret ${API_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('OTP Response:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching OTP:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch OTP from VdoCipher' });
    }
});

// Routes
app.use('/api/courses', courseRoutes);
app.use('/api/user', userRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/auth', authRoutes);
// Error handler
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err.stack);
    res.status(500).send({ error: 'Something went wrong!' });
});

// Server
const PORT = 5005;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
