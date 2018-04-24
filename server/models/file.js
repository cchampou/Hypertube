const mongoose = require('mongoose');

let FileSchema = new mongoose.Schema({
    path: {
        type: String,
        require: true
    },
    expire: {
        type: String,
        require: true
    }
});



let File = mongoose.model('File', FileSchema);


module.exports = { File };