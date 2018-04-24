const express = require('express');
const router = express.Router();
const _ = require('lodash');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const multer = require('multer');
const multerConf = require('./../middleware/upload.js')

const { mongoose } = require('./../database/mongoose.js');
const { User } = require('./../models/user.js');
const { ObjectID } = require('mongodb');
const authenticate = require('./../middleware/auth.js');



/***** List users *****/

router.get('/', authenticate, (req, res) => {
    User.find().then((users) => {
        if (!users){
            return res.status(404).send('No user found')
        }
        res.status(200).send(users)
    }).catch((err) => {
        res.status(404).send('Users not found')        
    })
});

/***** Create new user request *****/

router.post('/', multer(multerConf).single('avatar'), (req, res) => {
    let body = _.pick(req.body, ['username', 'email', 'firstName', 'lastName', 'password']);
    if (req.file && req.file.size > 0) {
        body.avatar = 'http://localhost:3000/' + req.file.path;    
    }
    let user = new User(body);
    var regularExpression = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;
    if (!regularExpression.test(body.password)) {
        return res.status(400).send('Password not secure')
    }
    user.hashPassword(body.password).then((hash) => {
    user.password = hash;
    user.tokens.push({ token : user.generateAuthToken() });
    }).then(() => {
        user.save((err) => {
            if (err) {
                return res.status(400).send('Email address or username already exists');
            }
            res.status(200).send(user);
        })
    }).catch((e) => {
        res.status(401).send('Bad request');
    })
});

/***** Object user request *****/

router.get('/select/:id?', authenticate, (req, res) => {
    let id = (req.params.id) ? req.params.id : req.user.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send('id incorrect')
    }
    User.findById(id).then((user) => {
        if (!user) {
            return res.status(404).send('user not found');
        }
        res.status(200).send(user);
    })    
})

/***** Update user request*****/

router.patch('/', [authenticate, multer(multerConf).single('avatar')], async (req, res) => {
    let id = req.user.id;
    let body = _.pick(req.body, ['username', 'firstName', 'lastName', 'email', 'password', 'language']);
    if (req.file && req.file.size > 0) {      
        body.avatar = 'http://localhost:3000/' + req.file.path;    
    }
    var regularExpression = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;
    let user = new User(body);
    if (body.password !== undefined) {
        if (!regularExpression.test(body.password)) {
            return res.status(400).send('Password not secure')
        }
        try {
            body.password = await user.hashPassword(body.password);
        } catch(err) {
            res.status(404).send('Password not saved')
        }
    }
    if (!ObjectID.isValid(id)) {
        return res.status(404).send('Invalid user');
    }
    User.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true }).then((user) => {
        if (!user) {
            return res.status(404).send(`Can\'t find ${id}`)
        }
        res.status(200).send(user);
    }).catch((e) => {
        console.log(e);
        if (e.code === 11000)
            return res.status(400).send('User already exist');
        return res.status(400).send('There was a issue updating user');
    })
 });

/***** Delete user request *****/

router.delete('/', authenticate, (req, res) => {
    let id = req.user.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send('id incorrect')
    }
    User.findByIdAndRemove(id).then((user) => {
        if (!user) {
            return res.status(404).send(`${id} , doesn\'t exist`);
        }
        res.status(200).send(`${user.username} has been removed`);
    }).catch((err) => {
        return res.status(400).send('User not removed, bad request');
    })
});

/***** forget password request *****/

router.post('/forget', (req, res) => {
    let body = _.pick(req.body, ['email']);
    let token = jwt.sign({token: 'hypertube'}, 'recoverpass')
    User.findOne({'email': `${body.email}`}, (err, user) => {
        if (!user) {
            return res.status(404).send('user not found');
        }
        user.forgetPassToken = token;
        user.save((err) => {
            if (err) {
                return res.status(400).send('error');
            }
            nodemailer.createTestAccount((err, account) => {
                let transporter = nodemailer.createTransport({
                    host : 'ssl0.ovh.net',
                    port : 465,
                    secure : true,
                    auth: {
                        user: 'hypertube@champouillon.com',
                        pass: 'b8gt5k98c'
                    }
                });
            
                let mailOptions = {
                    from: '"Hypertube team 👻" <hypertube.project.42@gmail.com>',
                    to: `${body.email}`,
                    subject: 'Forget password',
                    html: `Follow <a href="http://localhost:3001/newpass/${token}" target="_blank">this link</a> to recover your password`
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    console.log(error);
                    if (error) {
                        return res.status(400).send('mail not sent');
                    }
                    res.status(200).send('email sent');
                });
            });
        });
    });
})

router.post('/reset', async (req, res) => {
    let body = _.pick(req.body, ['password', 'token']);
    if (!body.token) {
        res.status(400).end('no token provided');
    }
    var regularExpression = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;
    if (!regularExpression.test(body.password)) {
        return res.status(400).send('password not secure')
    }
    User.findOne({ 'forgetPassToken': body.token }, async (err, user) => {
        if (user) {
            try {
                user.password = await user.hashPassword(body.password);
                user.forgetPassToken = null;
                user.save((err) => {
                    if (err) {
                        return res.status(400).send('user not changed');
                    }
                    res.status(200).send('Password changed');
                });
            } catch (err) {
                console.log(err);
                if (err) {
                    return res.status(400).send('error');
                }
            }
        } else {
            return res.status(400).send('user not found');
        }
    });
})

module.exports = router;
