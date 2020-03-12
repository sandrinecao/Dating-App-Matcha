var db = require('../config/connection');

exports.create = function(userId, targetId) {
    db.query('INSERT INTO blocks SET userId = ?, targetId = ?', [userId, targetId], function(err) {
        if (err) throw err
        else {
            console.log('Block with success!');
        }
    })
}

exports.delete = function(userId, targetId) {
    db.query('DELETE FROM blocks WHERE userId = ? AND targetId = ?', [userId, targetId], function(err) {
        if (err) throw err
        else {
            console.log('Unblock with success!');
        }
    })
}

exports.checkIfBlocked = function(userId, targetId, callback) {
    db.query('SELECT * FROM blocks WHERE userId = ? AND targetId = ?', [userId, targetId], function(err, rows) {
        if (err) throw err;
        callback (rows);
    })
}

exports.countBlocksNumber = function(userData, targetId, callback) {
    db.query('SELECT COUNT (*) AS number FROM Blocks WHERE targetId = ?', [targetId], function(err, row) {
        if (err) throw err;
        callback(row[0].number);
    })
}

// exports.checkIfBlockedWithusername = function(username1, username2, callback) {
//     db.query('SELECT * FROM blocks WHERE userId = (SELECT userId FROM users WHERE username = ? ) AND targetId = (SELECT userId FROM users WHERE username = ?)', [username1, username2], function(err, rows) {
//         if (err) throw err;
//         callback (rows);
//     })
// }