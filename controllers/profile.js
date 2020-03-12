var express = require('express');
var router = express.Router();
var session = require('express-session');
var User = require('../models/user');
var Image = require('../models/image');
var Tag = require('../models/tag');
var Like = require('../models/like');
var Block = require('../models/block');
var fs = require('fs-extra');
var fileUpload = require('express-fileupload');
var async = require('async');
var Notification = require('../models/notification');
var Message = require('../models/message');	
const { getDistance, convertDistance ,orderByDistance} = require('geolib');
//mail require
require('dotenv').config();
const nodemailer = require('nodemailer');
var io = require('socket.io');

router.get('/', function (req, res) {
    res.render('notFound', { layout: 'dashboard' });
})

router.get('/:username', function (req, res) {
    if (req.session.userId == undefined) {
        res.render('notFound', { layout: 'dashboard' });
        return;
      }
      if (req.session.userId && req.session.userId != undefined) {
              if (req.session.profilCompleted == 0) {
                      res.render('error', {layout: 'dashboard', error: "Please complete your profile to see this feature."});
                      return ;
              } else {
                  if (req.session.mainPic == 0) {
                      res.render('error', {layout: 'dashboard', error: "Set a profile picture to see this feature."});
                      return ;
                  }
              }
      }
    User.getByusername(req.params.username, function (user) {
        if (user != undefined) {
            req.session.targetId = user.userId;
            var url = 'http://localhost:5000/profile/' + req.params.username;
            let currentGeoloc = req.session.currentUser.geoloc.split(',');
            let targetPosition = user.geoloc.split(',');
            var distance = Math.round(getDistance({latitude: currentGeoloc[0], longitude: currentGeoloc[1]},{latitude: targetPosition[0], longitude: targetPosition[1]}) / 1000);
            Image.getAllByUserId(user.userId, function (images) {
                Image.getMain(user.userId, function (mainpix) {
                    Tag.getMine(user.userId, function (tags) {
                        Like.checkIfLiked(req.session.userId, user.userId, function (likeRows) {
                            if (likeRows.length > 0)
                                var likeStatus = true;
                            Block.checkIfBlocked(req.session.userId, user.userId, function (blockRows) {
                                if (blockRows.length > 0)
                                    var blockStatus = true;
                                Like.checkBoth(req.session.userId, user.userId, function (likes) {
                                    if (likes.length == 2)
                                        var connected = true;
                                    Like.checkLikeMe(user.userId, req.session.userId, function (rows) {
                                        if (rows.length == 1) {
                                            var likeMe = true;
                                        }
                                        Like.countLikesNumber(user, user.userId, function (nbLikes) {
                                            Block.countBlocksNumber(user, user.userId, function (nbBlocks) {
                                                user.popularity = (nbLikes * 10) - (nbBlocks);
                                                if (user.popularity < 0)
                                                        user.popularity = 0;
                                                Notification.get(req.session.userId, function (notifRows) {
                                                    Block.checkIfBlocked(user.userId, req.session.userId, function (result) {
                                                        if (result.length == 0)
                                                            Notification.create(req.session.userId, user.userId, 'Visit');
                                                        console.log('IMAGE = ' + JSON.stringify(images));
                                                        console.log('userId = ' + user.userId);
                                                        console.log('targetId = ' + req.session.targetId);
                                                        console.log(req.protocol + ':\/\/' + req.get('Host') + '/profile/' + req.params.username);
                                                        res.render('profile', {
                                                            layout: 'dashboard',
                                                            user: user,
                                                            distance: distance,
                                                            images: images,
                                                            mainpix: mainpix,
                                                            like: likeStatus,
                                                            connected: connected,
                                                            tags: tags,
                                                            block: blockStatus,
                                                            likeMe: likeMe,
                                                            currentUser: req.session.currentUser.username,
                                                            notification: notifRows,
                                                            url: url
                                                        });
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        } else {
            res.render('notFound', { layout: 'dashboard', error: "This page doesn't exist" });
        }
    });
})

router.post('/:username/like', function (req, res) {
    console.log('The person I like is userId/targetId = ' + req.session.targetId);
    Like.checkLikeMe(req.session.targetId, req.session.userId, function (rows) {
        Block.checkIfBlocked(req.session.targetId, req.session.userId, function(results) {
            if (results.length == 0) {
                if (rows.length > 0) {
                    Notification.create(req.session.userId, req.session.targetId, 'LikeBack');
                } else {
                    Notification.create(req.session.userId, req.session.targetId, 'Like');
                }
            }
        Like.create(req.session.userId, req.session.targetId);
        res.end();
    })
})
})

router.post('/:username/unlike', function (req, res) {
    Like.delete(req.session.userId, req.session.targetId);
    Block.checkIfBlocked(req.session.targetId, req.session.userId, function(results) {
        if (results.length == 0)
            Notification.create(req.session.userId, req.session.targetId, 'Unlike');
        res.end();
    })
})

router.post('/:username/block', function (req, res) {
    Block.create(req.session.userId, req.session.targetId);
    res.end();
})

router.post('/:username/unblock', function (req, res) {
    Block.delete(req.session.userId, req.session.targetId);
    res.end();
})

router.post('/:username/report', function (req, res) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.TRANSPORT_EMAIL,
            pass: process.env.TRANSPORT_PASSWORD,
        }
    });

    const html = ` Hi Admin,
                    <br/>
                    The user ${req.session.currentUser.username} has reported the following user as a FAKE PROFILE:
                    <br/>
                    Reported user: <b>${req.params.username}</b>
                    <br/>
                    See this filthy fake user on the following page:<br/>
                    ${req.protocol + ':\/\/' + req.get('Host') + '/profile/' + req.params.username}
                    <br/>`;

    let mailOptions = {
        from: 'From Matcha Team <Matcha@gmail.com>', // admin
        to: process.env.TRANSPORT_EMAIL, // admin
        subject: 'User reported as FAKE',
        html: html,
    };
    transporter.sendMail(mailOptions, (err, info) => {
        if (err)
            return console.log(err);
        else {
            console.log(user.email)
            console.log('Mail is sent!!!');
            res.end();
        }
    })
})


//CHATROOM
var createRoom = function(s1, s2) {	
    var arr = [];	
    arr.push(s1);	
    arr.push(s2);	
    arr.sort();	
    var roomName = arr.join("");	
    return (roomName);	
}	

router.get('/:username/chat', function(req, res) {	
    Like.checkBoth(req.session.userId, req.session.targetId, function(rows) {	
        if (rows.length !== 2) {	
            res.render('error', {layout: 'dashboard', error: "You are not allowed to chat with this profile."});	
            return;	
        } else {	
            console.log('CONTINUE');	
            let roomName = createRoom(req.session.currentUser.username, req.params.username);	
            User.getId(req.params.username, function(row) {	
                req.session.chatId = row.userId;	
                Message.getConversation(req.session.userId, req.session.chatId, function(rows) {	
                    Notification.get(req.session.userId, function(notifRows) {	
                        res.render('chat', {
                            layout: 'dashboard',
                            conversation: rows, 
                            room: roomName, 
                            currentUser: req.session.currentUser.username, 
                            notification: notifRows, 
                            dest: req.params.username});	
                    })	
                });	
            })	
        }	
    })	
})	
router.post('/:username/chat', function(req, res) {	
    if (req.body.content.trim() == "") {	
        console.log('Empty msg');	
        res.redirect('/profile/' + req.params.username + '/chat');	
        return;	
    }	
    Message.create(req.session.userId, req.session.chatId, req.body.content);	
    Block.checkIfBlocked(req.session.chatId, req.session.userId, function(rows) {	
        if (rows.length == 0) {	
            Notification.create(req.session.userId, req.session.chatId, 'Message');	
        }	
        res.redirect('/profile/' + req.params.username + '/chat');	
    })	
})

module.exports = router;