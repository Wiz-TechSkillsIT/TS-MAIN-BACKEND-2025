const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
    title:{
        type: String
    },
    sequence:{
        type: Number
    },
    moduleId:{
        type: String
    },
    playTime:{
        type: Number
    },
    
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course' // Reference back to Course schema
    },
    videos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Video' // Reference to Video schema
        }
    ]
});

module.exports = Employee = mongoose.model('Module',ModuleSchema);