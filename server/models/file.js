const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

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

FileSchema.plugin(findOrCreate);

let File = mongoose.model('File', FileSchema);


module.exports = { File };