const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
    title:{
        type: String
    },
    sequence:{
        type: Number
    },
    videoId:{
        type: String
    },
    playTime:{
        type: String
    },
    access: {
        type: String,
        default: 'PAID'
    },

    module: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module' // Reference to Module schema
    }
});

module.exports = Employee = mongoose.model('Video',VideoSchema);