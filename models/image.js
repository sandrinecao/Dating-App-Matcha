var db = require('../config/connection');

exports.checkMainPic = function(userId, callback) {
    db.query('SELECT name FROM images WHERE userId = ? AND profil = 1', [userId], function(err, rows) {
        if (err) throw err
        callback(rows);
    })
}

exports.getAll = function(userId, callback) {
    db.query('SELECT * FROM images WHERE userId = ? ORDER BY id DESC LIMIT 5', [userId], function(err, rows) {
        if (err) throw err
        callback(rows);
    })
}

exports.getAllByUserId = function(userId, callback) {
    db.query('SELECT * FROM images WHERE userId = ? ORDER BY id DESC LIMIT 5', [userId], function(err, rows) {
        if (err) throw err
        callback(rows);
    })
}

exports.create = function(userId, imgName, callback) {
    db.query('INSERT INTO images SET userId = ?, name = ?', [userId, imgName], function(err) {
        if (err) throw err;
        else {
            console.log('Image uploaded to the database')
        }
    })
}

exports.delete = function(userId, imgName, callback) {
    db.query('DELETE FROM images WHERE userId = ? AND name = ? LIMIT 1', [userId, imgName], function(err) {
        if (err) throw err;
        else {
            console.log('Image deleted in the database')
        }
    })
}

exports.resetProfil = function(userId, callback) {
    db.query('UPDATE images SET profil = 0 WHERE userId = ? AND profil = 1', [userId], function(err) {
			if (err) throw err
            console.log('reset ok');
		})
}

exports.setMain = function(userId, imgName, callback) {
			db.query('UPDATE images SET profil = 1 WHERE userId = ? AND name = ?', [userId, imgName], function(err) {
				if (err) throw err
				console.log('Main photo is set');
			})
}

exports.getMain = function(userId, callback) {
			db.query('SELECT name FROM images WHERE userId = ? AND profil = 1', [userId], function(err, data) {
				if (err) throw err
                callback(data[0].name);
			})
}