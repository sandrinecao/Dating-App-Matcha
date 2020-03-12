var express = require('express');
var router = express.Router();
var session = require('express-session');
var User = require('../models/user');
var Image = require('../models/image');
var Tag = require('../models/tag');
var Like = require('../models/like');
var Block = require('../models/block');
var Notification = require('../models/notification');
var userhelper = require('../helpers/userhelpers');
var async = require('async');
var io = require('socket.io');
const { getDistance, convertDistance ,orderByDistance} = require('geolib');

router.get('/', function (req, res) {
    if (req.session.userId && req.session.userId != undefined) {
        if (req.session.profilCompleted == 0) {
            res.render('error', { layout: 'dashboard', error: "Please complete your profile to see this incredible feature! ;)" });
            return;
        } else {
            if (req.session.mainPic == 0) {
                res.render('error', { layout: 'dashboard', error: "Please set a profile picture to see this feature. We need it to find you the best match! ;)" });
                return;
            } else {
                req.session.profilesTemp = undefined;
                User.getAllBySexPref(req.session.currentUser.gender, req.session.currentUser.sexpref, req.session.userId, function (all) {
                    userhelper.removeCurrentUser(req.session.currentUser.username, all)
                    userhelper.getTagsFromUser(req, res, all, false);
                });
            }
        }
    } else {
        res.redirect('/');
    }
})

router.get('/sort', function(req, res) {	
    res.redirect('/finder');	
});

router.post('/sort', function (req, res) {
    let arr = req.session.profiles;
    userhelper.sortBy(req, res, arr);
    Notification.get(req.session.userId, function (rows) {
        res.render('finder', {
            layout: 'dashboard',
            users: arr,
            currentUser: req.session.currentUser.username,
            notification: rows
        });
    })

})

router.get('/filter', function (req, res) {
    res.redirect('/finder');
})

router.post('/filter', function (req, res) {
    let arr = req.session.profiles;
    let newArr = [];
    if (req.body.filterAge)
        newArr = userhelper.filterBy('age', req.body.filterAge, arr);
    else if (req.body.filterDistance)
         newArr = userhelper.filterByRang(req.session.currentUser.geoloc, req.body.filterDistance, arr);
    else if (req.body.filterPopularity)
        newArr = userhelper.filterBy('popularity', req.body.filterPopularity, arr);
    else if (req.body.filterTags)
        newArr = userhelper.filterBy('tags', req.body.filterTags, arr);
    Notification.get(req.session.userId, function (rows) {
        {
            res.render('finder', {
                layout: 'dashboard',
                users: newArr,
                currentUser: req.session.currentUser.username,
                notification: rows
            });
        }
    })
})

module.exports = router;