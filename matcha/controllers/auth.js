var express = require('express');
var router = express.Router();
var session = require('express-session');
var User = require('../models/user');
var checkValidity = require('../middlewares/checkValidity');
var generator = require('generate-password');
var fs = require('fs-extra');
var dateformat = require('dateformat');
var db = require('../config/connection');
const secret = 'RANDOM_TOKEN_SECRET';
global.crypto = require('crypto')
var jwt = require('jsonwebtoken');
const passwordHash = require("password-hash");
const nodemailer = require('nodemailer');
var Tag = require('../models/tag');
const validate = require('../controllers/validation');
const faker = require('../models/faker');

// FAKER START
// router.get('/faker', faker.matchAppFaker);

router.get('/faker',faker.matchAppFaker, (req,res)=>{
  return res.json(faker());
})

// SIGN IN
router.get('/', function (req, res) {
  if (req.session.userId == undefined) {
    var err = { error: req.session.error }
    delete req.session.error;
    res.render('signin', err);
  }
  else
    res.redirect('/users/dashboard');
});

router.post('/', function (req, res) {
  let form = {
    username: req.body.username,
    password: req.body.password
  };
  User.getByusername(form.username, function (rows) {
    if (rows) {
      User.authenticate(form.username, rows.password, function (rows) {
        if (rows && passwordHash.verify(form.password, rows.password) == true && rows.mail_active) {
          User.saveLastConnection(rows.userId, dateformat("mediumDate"));
          req.session.userId = rows.userId;
        }
        else 
          req.session.error = 'Invalid username or password';
        res.redirect('/');
      })
    }
    else 
      res.redirect('/');
  });
});


// SIGN UP
router.get('/signup', function (req, res) {
  console.log(__dirname);
  if (req.session.userId != undefined) {
    res.redirect('/users/home');
  } else {
    let err = { error: req.session.error }
    delete req.session.error;
    res.render('signup', err);
  }
});

router.post('/signup', checkValidity, function (req, res, next) {
  let error = res.locals.error;
  if (error != undefined) {
    req.session.error = error;
    res.redirect('/auth/signup');
  }  else {
    var post_data = req.body;
    var email = post_data.email;
    new_data = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email,
      password: passwordHash.generate(req.body.password),
      tokenmail: req.body.tokenmail,
    }
    if (validate.validatePassword(req.body.password) && validate.validateEmail(req.body.email) && validate.validateUsername(req.body.username) && validate.validateFirstName(req.body.lastName) && validate.validateFirstName(req.body.firstName) && req.body.password == req.body.password_conf) {
        User.getByusername(post_data.username, function (rows){
          if (rows){
            console.log("this username is already used")
            req.session.error = 'This username is already used.';
            res.redirect('/auth/signup');
          }  else {
              User.create(new_data, function (err) {     
                if (err != 'created') {
                  req.session.error = 'This mail is already used.';
                  res.redirect('/auth/signup');
                } else {
                  if (!fs.existsSync('public/gallery/' + new_data.username))
                    fs.mkdirSync('public/gallery/' + new_data.username);
                  res.redirect('/auth/signupcheck');
                }})
            }
        })
    }
    else {
      req.session.error = 'One or more fields are not correct';
      // console.log("One or more fields are not correct")
      res.redirect('/auth/signup');
    }
  }
});


router.get('/signupcheck', function (req, res) {
  res.render('signupcheck')
});


// Forgot Password
router.get('/sendpwd', function (req, res) {
  res.render('sendpwd');
});

router.post('/sendpwd', function (req, res) {
  Tag.GetToken(req.body.email, function (rows) {
    if (rows != "") {
      tokenmail = rows[0].tokenmail
      console.log("test2")
      console.log(tokenmail);
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.TRANSPORT_EMAIL,
          pass: process.env.TRANSPORT_PASSWORD,
        }
      });
      const html = ` Hi there,
      <br/>
      You asked for a new password?
      <br/><br/>
      Please verify your email by typing the following token:
      <br/>
      Token: <b>${tokenmail}</b>
      <br/>
      on the following page:
      <a href="http://localhost:5000/auth/ChangePassword">Click here!!!</a>
      <br/><br/>
      Have a pleasant day!`;
      let mailOptions = {
        from: 'From Matcha Team <Matcha@gmail.com>', // TODO: email sender
        to: req.body.email, // TODO: email receiver
        subject: 'Password forgotten on Matcha',
        html: html,
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err)
          return console.log(err);
        else {
          console.log(email)
          console.log('Mail is send!!!');
        }
      });
      console.log("its ok ")
      res.redirect('/')
    }
    else {
      console.log("bad email")
      res.redirect('/')
    }
  });
});

// CONFIRMATION NEW PASSWORD
router.get('/ChangePassword', function (req, res) {
  res.render('ChangePassword');
});

router.post('/ChangePassword', function (req, res) {
  var key_token = req.body.key_token;
  pass_1 = req.body.password
  pass_2 = req.body.conf_password

  if (key_token && pass_1 === pass_2) {
    db.query('SELECT * FROM users where tokenmail=?', [key_token], function (err, result, fields) {
      db.on('error', function (err) { console.log('[MYSQL ERROR]', err); });
      if (result && result.length) {
        console.log(result)
        query = "UPDATE users SET password = ? WHERE tokenmail = ?";
        db.query(query, [passwordHash.generate(req.body.password), key_token], function (err, result, fields) {
          db.on('error', function (err) { console.log('[MYSQL ERROR]', err) })
        })
      }
    });
  }
  res.redirect('/')
});

// CONFIRMATION MAIL
router.get('/confirmationMail/:TokenMail', function (req, res) {
  var key_token = req.params.TokenMail;
  db.query('SELECT * FROM users where tokenmail=?', [key_token], function (err, result, fields) {
    db.on('error', function (err) {
      console.log('[MYSQL ERROR]', err);
    });
    if (result && result.length) {
      query = "UPDATE users SET mail_active = 1 WHERE tokenmail = ?";
      db.query(query, key_token, function (err, result, fields) { db.on('error', function (err) { console.log('[MYSQL ERROR]', err) }) })
    }
    res.redirect('/')
  })
})

// LOGOUT
router.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect('/auth');
});

module.exports = router;