const router = require('express').Router();
const passport = require ('passport');

const passportSetup = require('./../controllers/Oauth.js');

/***** Google Auth Strategy *****/

router.get('/google', passport.authenticate('google', {
     scope:['email', 'profile'] }));

router.get('/google/redirect', 
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('http://localhost:3001/authenticate/'+req.user.tokens[0].token);
});


/***** 42 Auth Strategy *****/

router.get('/42', passport.authenticate('42'));

router.get('/42/redirect',
    passport.authenticate('42', { session: false, failureRedirect: '/login', failureFlash: true }),
    function(req, res) {
        res.redirect('http://localhost:3001/authenticate/'+req.user.tokens[0].token);
});

/***** Local Auth Strategy *****/

router.post('/local',
    passport.authenticate('local', { session: false, }), (req,res) => {
        res.status(200).send(req.user);
    });

module.exports = router;
