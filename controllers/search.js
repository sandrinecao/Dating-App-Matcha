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

router.get('/', function (req, res) {
    if (req.session.userId && req.session.userId != undefined) {
        if (req.session.profilCompleted == 0) {
            res.render('error', { layout: 'dashboard', error: "Please complete your profile to see this incredible feature. ;)" });
            return;
        } else if (req.session.mainPic == 0) {
            res.render('error', { layout: 'dashboard', error: "Please set a profile picture to see this feature. We need it to find you the best match! ;)" });
            return;
        } else {
            User.getAllBySexPref(req.session.currentUser.gender, req.session.currentUser.sexpref, req.session.userId, function (all) {
                userhelper.removeCurrentUser(req.session.currentUser.username, all)
                userhelper.getTagsFromUser(req, res, all, true);
            });
        }
    } else {
        res.redirect('/');
    }
})

router.post('/', function (req, res) {
    let arr = req.session.profiles;
    Notification.get(req.session.userId, function (rows) {
        newArr = arr;
        if (req.body.searchAge) {
            newArr = userhelper.filterBy('age', req.body.searchAge, newArr);
            if (newArr.length == 0)
                return res.render('search', { layout: 'dashboard', users: newArr, empty: true, currentUser: req.session.currentUser.username, notification: rows })
        }
        else if (req.body.searchTags) {
            newArr = userhelper.filterBy('tags', req.body.searchTags, newArr);
            if (newArr.length == 0)
                return res.render('search', { layout: 'dashboard', users: newArr, empty: true, currentUser: req.session.currentUser.username, notification: rows })
        }
        else if (req.body.searchPopularity) {
            newArr = userhelper.filterBy('popularity', req.body.searchPopularity, newArr);
            if (newArr.length == 0)
                return res.render('search', { layout: 'dashboard', users: newArr, empty: true, currentUser: req.session.currentUser.username, notification: rows })
        }
        else if (req.body.searchDistance) {
            newArr = userhelper.filterByRang(req.session.currentUser.geoloc, req.body.searchDistance, arr);
            if (newArr.length == 0)
                return res.render('search', {layout: 'dashboard',users: newArr, empty: true, currentUser: req.session.currentUser.username, notification: rows})
        }
        req.session.profilesTemp = newArr;
        res.render('search', { layout: 'dashboard', users: newArr, temp: true, currentUser: req.session.currentUser.username, notification: rows })
    })
})

router.get('/sort', function (req, res) {
    res.redirect('/search');
});


router.post('/sort', function (req, res) {
    let arr = req.session.profilesTemp;
    if (arr == undefined) {
        res.redirect('/search');
    }
    else {
        userhelper.sortBy(req, res, arr);
        Notification.get(req.session.userId, function (rows) {
            res.render('search', { layout: 'dashboard', users: arr, currentUser: req.session.currentUser.username, notification: rows });
        })
    }
})

router.get('/filter', function (req, res) {
    res.redirect('/search');
})

router.post('/filter', function (req, res) {
    let arr = req.session.profilesTemp;
    if (arr == undefined) {
        res.redirect('/search');
        return;
    }
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
        res.render('search', { layout: 'dashboard', users: newArr, currentUser: req.session.currentUser.username, notification: rows });
    })
})

module.exports = router;