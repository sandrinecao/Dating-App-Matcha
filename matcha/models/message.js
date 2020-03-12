var db = require('../config/connection');

exports.create = function(userId, targetId, message) {
    db.query('INSERT INTO messages SET senderId = ?, receiverId = ?, message = ?', [userId, targetId, message], function(err) {
        if (err) throw err;
    })
}

exports.getConversation = function(userId, targetId, callback) {
    db.query('SELECT message, username FROM messages INNER JOIN users ON messages.senderId = users.userId WHERE (senderId = ? AND receiverId = ?) OR (senderId = ? AND receiverId = ?)', [userId, targetId, targetId, userId], function(err, rows) {
        if (err) throw err;
        callback (rows);
    })
}