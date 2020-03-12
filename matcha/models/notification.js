var db = require('../config/connection');

exports.create = function(userId, targetId, eventName) {
    db.query('INSERT INTO notifications SET userId = ?, targetId = ?, eventName = ?', [userId, targetId, eventName], function(err) {
        if (err) throw err;
    })
}

exports.checkExist = function(userId, targetId, eventName, callback) {
    db.query('SELECT * FROM notifications WHERE userId = ?, targetId = ?, eventName = ?', [userId, targetId, eventName], function(err, rows) {
        if (err) throw err;
        callback(rows);
    })
}

exports.get = function(targetId, callback) {
    db.query('SELECT id, eventName, username, status FROM notifications INNER JOIN users ON notifications.userId = users.userId WHERE targetId = ? ORDER BY id DESC LIMIT 10', [targetId], function(err, rows) {
        if (err) throw err;
        callback(rows);
    })
}

exports.getHistory = function(targetId, callback) {
    db.query('SELECT id, status, eventName, username FROM notifications INNER JOIN users ON notifications.userId = users.userId WHERE targetId = ? ORDER BY id DESC LIMIT 40', [targetId], function(err, rows) {
        if (err) throw err;
        callback(rows);
    })
}

exports.update = function(id) {
    db.query('UPDATE notifications SET status = 1 WHERE id = ?', [id], function(err) {
        if (err) throw err;
    })
}