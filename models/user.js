
var db = require('../config/connection');
//mail require
require('dotenv').config();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
var test = require('../models/user');

var User = function (firstName, lastName, age, username, email, gender, bio, sexpref, geoloc, position) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.age = age;
  this.username = username;
  this.email = email;
  this.gender = gender;
  this.bio = bio;
  this.sexpref = sexpref;
  if (position != '1') {
    this.geoloc = position;
    this.position = '1';
  }
  else {
    this.geoloc = geoloc;
    this.position = '1';
  }
}

exports.create = function (user, callback) {
  let token = ((+new Date) + Math.random() * 100).toString(32);
  let hashtoken = crypto.createHash('md5').update(token).digest("hex");
  var data = {
    gender: 'Man',
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    password: user.password,
    tokenmail: hashtoken,
    sexpref: 'Bisexual',

  };
  test.getByMail(data.email, function (err) {
    if (err) {
      callback('Email already exists');
      console.log("Email already used")
    }
    else
      db.query('INSERT INTO users SET ?', [data], function (err, result) {
        if (err) callback(err);

        else {
          callback('created');
          console.log('User created');
          let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.TRANSPORT_EMAIL,
              pass: process.env.TRANSPORT_PASSWORD,
            }
          });

          const html = ` Hi there, 
                        <br/>
                        Thank you for registering!
                        <br/><br/>
                        Please verify your email by clicking on the following link:
                        <br/>
                        <a href="http://localhost:5000/auth/confirmationMail/${hashtoken}">http://localhost:5000/auth/confirmationMail/${hashtoken}</a>
                        <br/><br/>
                        Have a pleasant day!`;

          let mailOptions = {
            from: 'From Matcha Team <Matcha@gmail.com>', // TODO: email sender
            to: user.email, // TODO: email receiver
            subject: 'Complete your registration on Matcha',
            html: html,
          };
          transporter.sendMail(mailOptions, (err, info) => {
            if (err)
              return console.log(err);
            else {
              console.log(user.email)
              console.log('Mail is send!!!');
            }
          })
        }
      })
  });
};

// Get a particular user from its userId
exports.getById = function (userId, callback) {
  db.query('SELECT * FROM users WHERE userId = ?', [userId], function (err, rows, fields) {
    if (err) throw err
    else {
      let user = new User(rows[0].firstName, rows[0].lastName, rows[0].age, rows[0].username, rows[0].email, rows[0].gender, rows[0].bio, rows[0].sexpref, rows[0].geoloc, rows[0].position);
      callback(user)
    }
  })
};

exports.getAllById = function (userId, callback) {
  db.query('SELECT * FROM users WHERE userId = ?', [userId], function (err, rows, fields) {
    if (err) throw err
    else {
      callback(rows)
    }
  })
};

exports.getMainPic = function (userId, user, callback) {
  db.query('SELECT name FROM images WHERE profil = 1 AND userId = ?', [userId], function (err, rows) {
    if (err) callback(err)
    else {
      let newuser = Object.assign(user, rows[0]);
      callback(newuser);
    }
  })
}

exports.getProfil = function (userId, callback) {
  db.query('SELECT name FROM images WHERE userId = ? AND profil = 1', [userId], function (err, rows, fields) {
    if (err) throw err
    else {
      let user = new User(rows[0].firstName, rows[0].lastName, rows[0].username, rows[0].email, rows[0].gender, rows[0].bio, rows[0].sexpref);
      callback(user)
    }
  })
};

// Get a particular user from its username
exports.getByusername = function (username, callback) {
  db.query('SELECT * FROM users WHERE username = ?', [username], function (err, rows, fields) {
    if (err) throw err
    callback(rows[0])
  })
};

exports.getId = function (username, callback) {
  db.query('SELECT userId FROM users WHERE username = ?', [username], function (err, rows, fields) {
    if (err) throw err
    callback(rows[0])
  })
};

// Get a particular user from its email adress
exports.getByMail = function (email, callback) {
  db.query('SELECT * FROM users WHERE email = ?', [email], function (err, rows, fields) {
    if (err) throw err
    callback(rows[0])
  })
};

// Get all user
exports.getAll = function (callback) {
  db.query('SELECT * FROM `users` INNER JOIN images ON users.userId = images.userId WHERE images.profil = 1', function (err, rows, fields) {
    if (err) throw err
    callback(rows)
  })
};

exports.getAllBySexPref = function (gender, sexpref, userId, callback) {
  let query = "";
  if (gender === 'Man' && sexpref === 'Bisexual') {
    query = "SELECT *, users.userId FROM `users` INNER JOIN images ON users.userId = images.userId LEFT OUTER JOIN blocks ON users.userId = blocks.targetId WHERE images.profil = 1 AND (users.sexpref = 'Bisexual' OR (users.gender = 'Man' AND users.sexpref = 'Homosexual') OR (users.gender = 'Woman' AND users.sexpref = 'Heterosexual')) AND users.userId NOT IN (SELECT targetId FROM blocks WHERE userId = ?)";
    db.query(query, [userId], function (err, rows, fields) {
      if (err) throw err
      callback(rows)
    })
  } else if (gender === 'Woman' && sexpref === 'Bisexual') {
    query = "SELECT *, users.userId FROM `users` INNER JOIN images ON users.userId = images.userId LEFT OUTER JOIN blocks ON users.userId = blocks.targetId WHERE images.profil = 1 AND (users.sexpref = 'Bisexual' OR (users.gender = 'Man' AND users.sexpref = 'Heterosexual') OR (users.gender = 'Woman' AND users.sexpref = 'Homosexual')) AND users.userId NOT IN (SELECT targetId FROM blocks WHERE userId = ?)";
    db.query(query, [userId], function (err, rows, fields) {
      if (err) throw err
      callback(rows)
    })
  } else if (gender === 'Man' && sexpref === 'Heterosexual') {
    query = "SELECT *, users.userId FROM `users` INNER JOIN images ON users.userId = images.userId LEFT OUTER JOIN blocks ON users.userId = blocks.targetId WHERE images.profil = 1 AND users.gender = 'Woman' AND (users.sexpref = 'Bisexual' OR users.sexpref = 'Heterosexual') AND users.userId NOT IN (SELECT targetId FROM blocks WHERE userId = ?)";
    db.query(query, [userId], function (err, rows, fields) {
      if (err) throw err
      callback(rows)
    })
  } else if (gender === 'Woman' && sexpref === 'Heterosexual') {
    query = "SELECT *, users.userId FROM `users` INNER JOIN images ON users.userId = images.userId LEFT OUTER JOIN blocks ON users.userId = blocks.targetId WHERE images.profil = 1 AND users.gender = 'Man' AND (users.sexpref = 'Bisexual' OR users.sexpref = 'Heterosexual') AND users.userId NOT IN (SELECT targetId FROM blocks WHERE userId = ?)";
    db.query(query, [userId], function (err, rows, fields) {
      if (err) throw err
      callback(rows)
    })
  } else if (gender === 'Man' && sexpref === 'Homosexual') {
    query = "SELECT *, users.userId FROM `users` INNER JOIN images ON users.userId = images.userId LEFT OUTER JOIN blocks ON users.userId = blocks.targetId WHERE images.profil = 1 AND users.gender = 'Man' AND (users.sexpref = 'Bisexual' OR users.sexpref = 'Homosexual') AND users.userId NOT IN (SELECT targetId FROM blocks WHERE userId = ?)";
    db.query(query, [userId], function (err, rows, fields) {
      if (err) throw err
      callback(rows)
    })
  } else if (gender === 'Woman' && sexpref === 'Homosexual') {
    query = "SELECT *, users.userId FROM `users` INNER JOIN images ON users.userId = images.userId LEFT OUTER JOIN blocks ON users.userId = blocks.targetId WHERE images.profil = 1 AND users.gender = 'Woman' AND (users.sexpref = 'Bisexual' OR users.sexpref = 'Homosexual') AND users.userId NOT IN (SELECT targetId FROM blocks WHERE userId = ?)";
    db.query(query, [userId], function (err, rows, fields) {
      if (err) throw err
      callback(rows)
    })


  } else if (gender === 'Man' && sexpref === 'Pansexual') {
    query = "SELECT *, users.userId FROM `users` INNER JOIN images ON users.userId = images.userId LEFT OUTER JOIN blocks ON users.userId = blocks.targetId WHERE images.profil = 1 AND (users.sexpref = 'Pansexual' OR (users.gender = 'Man' AND users.sexpref = 'Heterosexual') OR (users.gender = 'Man' AND users.sexpref = 'Homosexual') OR (users.gender = 'Man' AND users.sexpref = 'Bisexual') OR (users.gender = 'Man' AND users.sexpref = 'Pansexual') OR (users.gender = 'Woman' AND users.sexpref = 'Heterosexual') OR (users.gender = 'Woman' AND users.sexpref = 'Homosexual') OR (users.gender = 'Woman' AND users.sexpref = 'Bisexual')) AND users.userId NOT IN (SELECT targetId FROM blocks WHERE userId = ?)";
    db.query(query, [userId], function (err, rows, fields) {
      if (err) throw err
      callback(rows)
    })
  } else if (gender === 'Woman' && sexpref === 'Pansexual') {
    query = "SELECT *, users.userId FROM `users` INNER JOIN images ON users.userId = images.userId LEFT OUTER JOIN blocks ON users.userId = blocks.targetId WHERE images.profil = 1 AND (users.sexpref = 'Pansexual' OR (users.gender = 'Man' AND users.sexpref = 'Heterosexual') OR (users.gender = 'Man' AND users.sexpref = 'Homosexual') OR (users.gender = 'Man' AND users.sexpref = 'Bisexual') OR (users.gender = 'Man' AND users.sexpref = 'Pansexual') OR (users.gender = 'Woman' AND users.sexpref = 'Heterosexual') OR (users.gender = 'Woman' AND users.sexpref = 'Homosexual') OR (users.gender = 'Woman' AND users.sexpref = 'Bisexual')) AND users.userId NOT IN (SELECT targetId FROM blocks WHERE userId = ?)";
    db.query(query, [userId], function (err, rows, fields) {
      if (err) throw err
      callback(rows)
    })


  }
};

exports.getAllByAge = function (callback) {
  db.query('SELECT * FROM `users` INNER JOIN images ON users.userId = images.userId WHERE images.profil = 1 ORDER BY users.age', function (err, rows, fields) {
    if (err) throw err
    callback(rows)
  })
};

// Authenticate with mail and password
exports.authenticate = function (username, password, callback) {
  db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function (err, rows, fields) {
    if (err) throw err
    callback(rows[0])
  })
};

exports.saveLastConnection = function (userId, dateformat) {
  db.query('UPDATE users SET lastConnection = ? WHERE userId = ?', [dateformat, userId], function (err, rows, fields) {
    if (err) throw err
  })
};

exports.setPassword = function (email, password) {
  db.query('UPDATE users SET password = ? WHERE email = ?', [password, email], function (err) {
    if (err) throw err
    console.log('New email sent!');
  })
};

exports.changePassword = function (email, password) {
  db.query('UPDATE users SET password = ? WHERE email = ?', [password, email], function (err) {
    if (err) throw err
    console.log('Password changed!');
  })
};

exports.SelectAllFromEmail = function (email, callback) {
  db.query('SELECT * FROM users WHERE email = ?', email, function (err, rows, fields) {
    if (err) throw err
    callback(rows[0])
  })
};

exports.save = function (profil, userId) {

  var post = {
    firstName: profil.firstName,
    lastName: profil.lastName,
    username: profil.username,
    age: profil.age,
    email: profil.email,
    gender: profil.gender,
    sexpref: profil.sexpref,
    bio: profil.bio,
    geoloc: profil.geoloc,
    position: profil.position
  }
  if (profil.position != '1') {
    post.geoloc = post.position;
    post.position = '1';
  }
  else {
    post.geoloc = post.geoloc;
    post.position = '1';
  }
  db.query('UPDATE users SET ? WHERE userId = ?', [post, userId], function (err) {
    if (err) console.log(err);
    else {
      console.log('Profil updated!');
    }
  })
};

//position: '48.8407147, 2.35379' 20 rue censier