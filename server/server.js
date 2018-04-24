const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const passport = require('passport')

const http = require('http').Server(app);

const io = require('socket.io')(http);

const authenticate = require('./middleware/auth.js')

const PORT = process.env.PORT || 3000;
app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, X-Auth, Content-Type, Accept");
    next();
  });

app.use(passport.initialize());
app.use('/uploads', express.static('uploads'))

/***** Routes *****/

const user = require('./routes/user.js');
const auth = require('./routes/auth.js');
const video = require('./routes/video.js')(io);

app.use('/user', user);
app.use('/video', video);
app.use('/auth', auth);

/***** Listen *****/

http.listen(PORT, () => {
    console.log(`listen on port ${PORT}`)
});