const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const findOrCreate = require('mongoose-findorcreate');
const jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 1
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 1,
        validate: {
            validator: validator.isEmail,       
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        minlength: 6
    },
    firstName: {
        type: String,
        required: false,
        trim: true,
        minlength: 1
    },
    lastName: {
        type: String,
        required: false,
        trim: true,
        minlength: 1
    },
    avatar: {
        type: String,
        default: null
    },
    language: {
        type: String,
        default: 'english'
    },
    tokens: [{
        token: {
          type: String,
          required: true
        }
    }],
    forgetPassToken: {
        type: String, 
        default: null
    },
    seen: [{
        type: String
    }]
});

UserSchema.plugin(findOrCreate);

UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var token = jwt.sign({id: user._id.toHexString(), date : new Date() }, 'abc123').toString();
    return token;
}

UserSchema.methods.hashPassword = function (password) {
    return new Promise ((resolve, reject) => {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                reject(err);
            }
            resolve(hash);
        })
    })
}

UserSchema.methods.validPassword = function (password, ok) {
    let user = this;
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, function (err, res) {
            if (err) {
                reject(err);
            } else if (!res) {
                reject(res);
            } else {
                resolve(res);
            }
        })
    })
}

UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;
  
    try {
      decoded = jwt.verify(token, 'abc123');
    } catch (e) {
      return Promise.reject(e);
    }
    return User.findOne({
        '_id': decoded.id,
        'tokens.token': token
    });
};

var User = mongoose.model('User', UserSchema);

module.exports = { User };