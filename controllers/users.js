var express = require('express');
var router = express.Router();
var session = require('express-session');
var User = require('../models/user');
var Image = require('../models/image');
var Tag = require('../models/tag');
var Notification = require('../models/notification');
var fs = require('fs-extra');
var fileUpload = require('express-fileupload');
var checkProfil = require('../middlewares/checkProfil');
var userhelper = require('../helpers/userhelpers')
var async = require('async');
var validate = require('./validation');
const passwordHash = require("password-hash");
var checkPassword = require('../middlewares/checkPassword');

router.get('/home', function (req, res) {
	if (req.session.userId == undefined) {
		res.redirect('/auth');
	}
	else {
		res.redirect('/users/dashboard');
	}
});

router.get('/map', function (req, res) {
	if (req.session.userId == undefined) {
		res.redirect('/auth');
	}
	else {
		
		User.getAll(function (rows){
		res.render('map', {rows: rows});
		})
	}
});

router.get('/dashboard', function (req, res) {
	if (req.session.userId != undefined) {
		Image.checkMainPic(req.session.userId, function (mainPic) {
			if (mainPic.length == 0) {
				req.session.mainPic = 0;
			} else {
				req.session.mainPic = 1;
			}
		})
		User.getAllById(req.session.userId, function (rows) {
			if (userhelper.checkEmptyField(rows[0]) == false) {
				req.session.profilCompleted = 0;
			} else {
				req.session.profilCompleted = 1;
			}
		})
		var error = req.session.error;
		delete req.session.error;
		Tag.getMine(req.session.userId, function (userTags) {
			Tag.getAll(function (rows) {
				User.getById(req.session.userId, function (user) {
					req.body.firstName = user.firstName;
					req.body.lastName = user.lastName;
					req.body.age = user.age;
					req.body.username = user.username;
					req.body.email = user.email;
					req.body.gender = user.gender;
					req.body.bio = user.bio;
					req.body.sexpref = user.sexpref;					
					// rajouter ou ici				
					//48.8407147, 2.35379 censier 
					//48.8966984, 2.3183670999999997 ecole 

						if (user.position != '1'){
							req.body.geoloc = user.position;
							req.body.position = '1';
						}
						else
						{
							req.body.geoloc = user.geoloc;
							req.body.position = '1';
						}
					
					// CONVERT TAGS ROWS IN ARRAY OF STRING
					var tags = userTags.map(function (elem) {
						return (elem['name']);
					})

					// SAVE USER OBJECT IN SESSION
					req.session.currentUser = user;
					req.session.currentUser.tags = tags.join();

					User.getMainPic(req.session.userId, user, function (err) {
						Notification.get(req.session.userId, function (notifs) {
							Image.getAllByUserId(req.session.userId, function (images) {
								if (rows.length > 0) {
									res.locals.images = rows;
								}
								res.render('dashboard', {
									layout: 'dashboard',
									error: error,
									images: images,
									data: { user },
									tags: { rows },
									userTags: userTags,
									currentUser: user.username,
									notification: notifs,
								});
							})
						})
					})
				})
			})
		})
	} else {
		res.redirect('/auth');
	}
})

router.post('/dashboard/form', checkProfil, function(req, res) {
// router.post('/dashboard/form', function (req, res) {
	if (res.locals.error != undefined) {
		req.session.error = res.locals.error;
		console.log('Error! ' + res.locals.error)
		res.redirect('/users/dashboard');
		return;
	}
	
	let profil = {
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		username: req.body.username,
		age: req.body.age,
		email: req.body.email,
		gender: req.body.gender,
		sexpref: req.body.sexpref,
		bio: req.body.bio,
		geoloc: req.body.geoloc,
		position: req.body.position
	};
	User.getByusername(req.body.username, function (rows){
		if (rows){
		  console.log("this username is already used")
		  req.session.error = 'This username is already used.';
		  res.redirect('/auth/signup');
		}
		else 
		{
	console.log(req.body.position)
	console.log(profil);
	User.save(profil, req.session.userId);
	Tag.deleteMine(req.session.userId);
	let tags = req.body.tags.split(',');
	async.eachSeries(tags, function (elem, callback) {
		Tag.create(elem, function (result) {
			if (result == false)
				console.log(elem + ' already exist.');
			Tag.getId(elem, function (row) {
				Tag.relate(req.session.userId, row.tagId);
				callback(false);
			})
		})
	},
		function (err) {
			req.session.profilCompleted = 1;
			res.redirect('/users/dashboard');
		})
	}
})
})

//NEW PASSWORD SECTION
router.post('/dashboard/newpass', checkPassword,function (req, res) {
	if (res.locals.error != undefined) {
		req.session.error = res.locals.error;

		console.log('erreur' + res.locals.error)
		res.redirect('/users/dashboard');
		return;
	}
	User.SelectAllFromEmail(req.session.currentUser.email, function (rows) {
		console.log(req.body.newpassword)
		console.log(req.body.newpassword1)
		if (rows && passwordHash.verify(req.body.password, rows.password) == true) {
			if (req.body.newpassword === req.body.newpassword1) {
				if (req.body.password != req.body.newpassword) {
					if (validate.validatePassword(req.body.newpassword)) {
						let finalpass = passwordHash.generate(req.body.newpassword)
						User.changePassword(req.session.currentUser.email, finalpass)
					}
					else {
						console.log("not valide password")
					}
				}
				else {
					console.log("password are the same bitch")
				}
			}
			else {
				console.log("not same new password")
			}
		}
	},
	function (err) {
		res.redirect('/users/dashboard');
	})
	res.redirect('/users/dashboard');
})

router.post('/dashboard/gallery', function (req, res) {
	User.getById(req.session.userId, function (user) {
		var file = req.files.file;
		if (file == undefined || (file.mimetype != 'image/jpeg' && file.mimetype != 'image/png')) {
			req.session.error = 'The picture has an invalid format, please try again or choose another one.';
			console.log('Invalid format');
		} else {
			let timestamp = new Date().getTime();
			let path = 'public/gallery/' + user.username + '/' + (user.username + '_' + timestamp);
			let imgName = '/static/gallery/' + user.username + '/' + (user.username + '_' + timestamp);
			file.mv(path, function (err) {
				if (err) req.session.error = 'Error while saving in local';
				else {
					console.log('Image uploaded!');
				};
			})
			Image.create(req.session.userId, imgName, function (err) {
				if (err) console.log(err);
			});
		}
		res.redirect('/users/dashboard')
	});
})

router.post('/dashboard/remove', function (req, res) {
	if (req.body.hidden == "") {
		res.redirect('/users/dashboard');
		return;
	}
	Image.delete(req.session.userId, req.body.hidden, function (err) {
		if (err) throw err;
	})
	res.redirect('/users/dashboard');
})

router.post('/dashboard/setmain', function (req, res) {
	if (req.body.hidden == "") {
		res.redirect('/users/dashboard');
		return;
	}
	Image.resetProfil(req.session.userId, function (err) {
		if (err) throw err;
	})
	Image.setMain(req.session.userId, req.body.setmain, function (err) {
		if (err) throw err;
		req.session.mainPic = 1;
	})
	res.redirect('/users/dashboard');
})


//NOTIFCATIONS AND HISTORY
router.post('/notification', function (req, res) {
	Notification.update(req.body.id);
	res.end();
})

router.get('/history', function (req, res) {
	if (req.session.userId == undefined || req.session.userId == "") {
		res.redirect('/');
	} else {
		Notification.get(req.session.userId, function (rows) {
			Notification.getHistory(req.session.userId, function (history) {
				res.render('history', {
					layout: 'dashboard',
					currentUser: req.session.currentUser.username,
					notification: rows,
					history: history
				});
			})
		});
	}
})

module.exports = router;