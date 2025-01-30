const mongoose = require('mongoose');
// User Schema
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profileImage: String,
    whatsapp: String,
    phone: String,
    city: String,
    college: String,
    company: String,
});
// Export the Course model
module.exports = mongoose.model('User', UserSchema);