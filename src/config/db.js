const mongoose = require('mongoose');

function dbConnect(){
    try{
        mongoose.connect('mongodb+srv://imtiyaz:G9evbmUU4SB42Z2m@ts.0s4ka.mongodb.net/techskills?retryWrites=true&w=majority&appName=TS')
        console.log('DB connected..')
    }
    catch(err){
        console.log(err);
        process.exit(1);
    }
}

module.exports = {dbConnect};