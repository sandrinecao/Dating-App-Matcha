var express = require('express');
var router = express.Router();
var session = require('express-session');
var User = require('../models/user');
var Tag = require('../models/tag');
var Like = require('../models/like');
var Block = require('../models/block');
var Notification = require('../models/notification');
var fs = require('fs-extra');
var fileUpload = require('express-fileupload');
var async = require('async');
var userhelper = require('../helpers/userhelpers');
const { getDistance, convertDistance ,orderByDistance} = require('geolib');

exports.countSameTags = function (arr1, arr2) {
    var nbTags = 0;
    if (arr1.length > arr2.length) {
        var tmp;
        tmp = arr1;
        arr1 = arr2;
        arr2 = tmp;
    }
    for (var i = 0; i < arr2.length; i++) {
        for (var j = 0; j < arr1.length; j++) {
            if (arr2[i] == arr1[j]) {
                nbTags++;
            }
        }
        j = 0;
    }
    return (nbTags);
}

//La table users doit être totalement remplie pour voir les autres profils
exports.checkEmptyField = function (obj) {
    for (var i in obj) {
        if (obj[i] == "" || obj[i] == "NULL" || obj[i] == undefined)
            return (false);
    }
    return (true);
}

//FINDER PAGE
//Current user doit etre exclu des recherches
exports.removeCurrentUser = function (userName, arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].username == userName) {
            arr.splice(i, 1);
        }
    }
}

exports.getTagsFromUser = function (req, res, all, search) {
    async.eachSeries(all, function (elem, callback) {
        Tag.getUserTags(elem, function (rows, user) {
            var tags = rows.map(function (elem) {
                return (elem['name']);
            });
            elem.tags = tags;
            elem.sameTags = userhelper.countSameTags(req.session.currentUser.tags.split(','), tags);
           
            Like.checkIfLiked(req.session.userId, elem.userId, function (likeRows) {
                if (likeRows.length > 0)
                    var likeStatus = true;
                elem.like = likeStatus;
                Like.countLikesNumber(elem, elem.userId, function (nbLikes) {
                    Block.countBlocksNumber(elem, elem.userId, function (nbBlocks) {
                        elem.popularity = (nbLikes * 10) - (nbBlocks);
                        if (elem.popularity < 0)
                        elem.popularity = 0;
                        callback(false);
                    })
                })
            })
        })
    }, function (err) {
        if (err) {
            console.log('AN ERROR HAS OCCURED');
        }
        userhelper.showKm(req.session.currentUser.geoloc, all);
        req.session.profiles = all;


        all.sort(function(a, b) {
            if (b.distance < 150)
                 return b.sameTags - a.sameTags;
             else
                 return 0;
         });

         all.sort(function(a, b) {
    
            return (a.distance - b.distance);
        });
        
        all.sort(function(a, b) {
            if (b.distance < 150)
                return b.popularity - a.popularity;
            else
                return 0
        });
      

    
       
        // 6586 

        console.log(all[0]);
        console.log(all[1]);
        console.log(all[2]);
        console.log(all[3]);
        console.log(all[4]);

        Notification.get(req.session.userId, function(rows) {
        if (search === false)
            res.render('finder', {
                layout: 'dashboard',
                users: all,
                currentUser: req.session.currentUser.username,
                notification: rows

            });
        else
            res.render('search', {
                layout: 'dashboard',
                search: true,
                currentUser: req.session.currentUser.username,
                notification: rows
            });
    })
    })
}

exports.sortBy = function (req, res, arr) {
    if (req.body.sort === 'ageAsc') {
        arr.sort(function (a, b) {
            return (a.age - b.age);
        })
    } else if (req.body.sort == 'ageDesc') {
        arr.sort(function (a, b) {
            return (b.age - a.age);
        })
    } else if (req.body.sort == 'location') {
        arr.sort(function (a, b) {
            var Savegeo = req.session.currentUser.geoloc;
            var tabsave = [];
            var tab = [];
            var elem1 = Trans(a.geoloc);
            var elem2 = Trans(b.geoloc);
            tab[0] = elem1;
            tab[1] = elem2;
            tabsave = orderByDistance(Trans(Savegeo) , tab)
            if (tabsave[0] == tab[0] && tabsave[1] == tab[1]){
                return (-1);
            }
            else 
                return (1);          
        }) 
    } else if (req.body.sort == 'popularityHigh') {
        arr.sort(function (a, b) {
            return (b.popularity - a.popularity);
        })
    } else if (req.body.sort == 'popularityLow') {
        arr.sort(function (a, b) {
            return (a.popularity - b.popularity);
        })
    } else if (req.body.sort == 'sameTags') {
        arr.sort(function (a, b) {
            return (b.sameTags - a.sameTags);
        })
    } else {
        Notification.get(req.session.userId, function(rows) {
        res.render('search', {
            layout: 'dashboard',
            users: arr,
            currentUser: req.session.currentUser.username,
            notification: rows
        });
        return;
        })
    }
}

exports.filterBy = function (filterName, filterValue, arr) {
    var newArr = [];
    if (filterName === 'tags') filterName = 'sameTags';
    var range = filterValue.split('-');
    var min = range[0];
    var max = range[1];
    for (var i = 0; i < arr.length; i++) {
        let elem = arr[i];
        if (elem[filterName] >= min && elem[filterName] <= max)
            newArr.push(elem);
    }
    return (newArr);
};

exports.filterByRang = function (UserGeoloc, filterValue, arr) {
    var newArr = [];
    var range = filterValue.split('-');
    var min = range[0]; // 0
    var max = range[1]; // 30 
    for (var i = 0; i < arr.length; i++) {
        let elem = arr[i]
        if (UserGeoloc && arr[i].geoloc)
            distance = convertDistance(getDistance(Trans(UserGeoloc) ,Trans(arr[i].geoloc), 1000), 'km');
        if (distance >= min && distance <= max)
            newArr.push(elem);
    }
    return (newArr);
};

function Trans(position)
{
    if (!position)
        return
position = position.replace(' ', '');
var tab
tab = position.split(',')
var objet = {
    latitude: tab[0],
    longitude: tab[1],
}
return(objet);
}

exports.showKm = function(UserGeoloc, arr) {
    for (var i = 0; i < arr.length; i++) {
        arr[i].distance = convertDistance(getDistance(Trans(UserGeoloc) ,Trans(arr[i].geoloc), 1000), 'km');
    }
}