var db = require('../config/connection');

exports.create = function(name, callback) {
  db.query('INSERT INTO tags SET name = ?', [name], function(err) {
		if (err) callback(false);
		else {
		callback('new tag created');
		}
	})
}

exports.getId = function(name, callback) {
	console.log('name = ' + name)
	db.query('SELECT tagId FROM tags WHERE name = ?', [name], function(err, rows) {
		if (err) throw err;
		callback(rows[0]);
	})
}

exports.getAll = function(callback) {
	db.query('SELECT * FROM tags', function(err, rows) {
		if (err) throw err;
		callback(rows);
	})
}

exports.getMine = function(userId, callback) {
	db.query('SELECT name FROM tags INNER JOIN user_tags ON tags.tagId = user_tags.tagId WHERE userId = ?', [userId], function(err, rows) {
		if (err) throw err;
		callback(rows);
	})
}

exports.getUserTags = function(userObject, callback) {
	db.query('SELECT name FROM tags INNER JOIN user_tags ON tags.tagId = user_tags.tagId WHERE userId = ?', [userObject.userId], function(err, rows) {
		if (err) throw err;
		callback(rows);
	})
}

exports.deleteMine = function(userId) {
	db.query('DELETE FROM user_tags WHERE userId = ?', [userId], function(err) {
		if (err) throw err;
	})
}

exports.relate = function(userId, tagId) {
	db.query('INSERT INTO user_tags SET userId = ?, tagId = ?', [userId, tagId], function(err) {
		if (err) throw err;
	})
}

exports.GetToken = function(email, callback) {
	db.query('SELECT tokenmail FROM users WHERE email = ?', [email], function(err, rows) {
		if (err)
			throw err;
		// console.log(rows[0].tokenmail);
		callback(rows)

	})
}