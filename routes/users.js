const express = require('express');
const router = express.Router();
const multer = require('multer');
const User = require('../models/User');
const upload = multer({dest: './uploads'});
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/register',function(req, res, next) {
    res.render('register',{title:"Register"});
});
router.post('/register',upload.single('profileimage'),function(req, res, next){
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;
    let profileimage = 'noimage.jpg';
    if (req.file){
        console.log('uploading File...');
        profileimage = req.file.filename;
    }
    // Form validator
    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('email', 'E-Mail field is required').notEmpty();
    req.checkBody('email', 'E-mail is not valid').isEmail();
    req.checkBody('username', 'Username field is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    // Check Errors
    const errors = req.validationErrors();
    if (errors){
        console.log(errors);
        res.render('register', {
          errors : errors
        })
    } else {
        const newUser = new User({
            name,
            email,
            username,
            password,
            profileimage
        });
        User.createUser(newUser,(err, user)=>{
            if(err) throw err;
            req.flash('success', "You are now registered and can login");
            res.location('/');
            res.redirect('/');
        });
    }
});

router.get('/login', function(req, res, next) {
    res.render('login',{title:"Login"});
});
router.post('/login',
    passport.authenticate('local',{
        failureRedirect: '/users/login',
        failureFlash: 'Invalid username or password'
    }),
    function(req, res) {
        req.flash('success', 'You are now logged in');
        res.redirect('/');
    });
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});
passport.use(new LocalStrategy((username, password, done) => {
    User.getUserByUsername(username,(err, user)=>{
        if (err) throw err;
        if(!user){
            return done(null,false,{
                message: 'Unknown User'
            });
        }
        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) return done(err);
            if (isMatch){
                return done(null,user);
            }else {
                return done(null,false,{
                    message: 'Invalid Password'
                })
            }
        });
    })
}));

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success', 'You are now logged out');
    res.redirect('/users/login');
});

module.exports = router;
