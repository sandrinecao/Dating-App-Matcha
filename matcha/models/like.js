var db = require('../config/connection');

exports.create = function(userId, targetId) {
    db.query('INSERT INTO likes SET userId = ?, targetId = ?', [userId, targetId], function(err) {
        if (err) throw err
        else {
            console.log('Like with success!');
        }
    })
}

exports.checkIfLiked = function(userId, targetId, callback) {
    db.query('SELECT * FROM likes WHERE userId = ? AND targetId = ?', [userId, targetId], function(err, rows) {
        if (err) throw err;
        callback (rows);
    })
}

exports.checkLikeMe = function(userId, targetId, callback) {
    db.query('SELECT * FROM likes WHERE userId = ? AND targetId = ?', [userId, targetId], function(err, rows) {
        if (err) throw err;
        callback (rows);
    })
}

exports.delete = function(userId, targetId) {
    db.query('DELETE FROM likes WHERE userId = ? AND targetId = ?', [userId, targetId], function(err) {
        if (err) throw err
        else {
            console.log('Unlike with success!');
        }
    })
}

// Si (rows.length == 2) DONC les 2 users se sont likés mutuellement
exports.checkBoth = function(userId, targetId, callback) {
    db.query('SELECT * FROM likes WHERE (userId = ? AND targetId = ?) OR (userId = ? AND targetId = ?)', [userId, targetId, targetId, userId], function(err, rows) {
        if (err) throw err;
        callback(rows);
    })
}

exports.countLikesNumber = function(userData, targetId, callback) {
    db.query('SELECT COUNT (*) AS number FROM Likes WHERE targetId = ?', [targetId], function(err, row) {
        if (err) throw err;
        callback(row[0].number);
    })
}