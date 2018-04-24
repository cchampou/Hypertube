const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const findOrCreate = require('mongoose-findorcreate');

let CommentSchema = new mongoose.Schema(
    {
        author: {
            type: String,
            required: true,
            trim: true,
        },
        text: {
            type: String,
            required: true,
            trim: true,
        },
        date: {
            type: String,
            trim: true
        }
    }
);

let VideoSchema = new mongoose.Schema({
    idmovieDb: {
        type: String,
        require: true
    },
    comment: [CommentSchema]
});

VideoSchema.plugin(findOrCreate);


let Video = mongoose.model('Video', VideoSchema);


module.exports = { Video };