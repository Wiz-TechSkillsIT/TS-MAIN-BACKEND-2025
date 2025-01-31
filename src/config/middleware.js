const jwt = require('jsonwebtoken');

const JWT_SECRET_KEY = '151183200722';

// Middleware for JWT validation
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Token is required!' });
    }

    const token = authHeader.split(' ')[1]; // Remove 'Bearer ' prefix

    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        req.user = decoded; // Attach user info to the request
        next();
    } catch (err) {
        console.error('JWT Verification Failed:', err.message);
        return res.status(401).json({ error: 'Invalid or expired token!' });
    }
};

// ✅ FIX: Export correctly for CommonJS
module.exports = authenticateJWT;
