var mysql = require('mysql');

var db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	// password: '123456'
});

db.connect(function (err) {
	if (err) throw err;
	console.log('Successfully connected to MySQL on port 3306');

	/**
	 * Create Database "matcha"
	 */
	db.query('create database if not exists matcha CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;', function (err) {
		if (err) throw err;
		console.log('Successfully created `matcha` database');
	});

	/**
	 * Create Table "Users"
	 *
	 * This Table content the min information for created one user
	 */
	db.query(`create table if not exists matcha.users(
		userId INT NOT NULL AUTO_INCREMENT PRIMARY KEY ,
		username VARCHAR(255) NOT NULL,
		firstName VARCHAR(255) NOT NULL,
		lastName VARCHAR(255) NOT NULL,
		age int(5) DEFAULT NULL,
		email VARCHAR(255) NOT NULL,
		password TEXT NOT NULL,
		tokenmail VARCHAR(255) NULL ,
		mail_active TINYINT(1) DEFAULT NULL,
		gender varchar(20) DEFAULT NULL,
		bio text,
		sexpref varchar(20) DEFAULT NULL,
		geoloc varchar(255) DEFAULT NULL,
		position varchar(255) DEFAULT NULL,
		lastConnection varchar(100) DEFAULT NULL
	);`, function (err) {
		if (err) throw err;
	});

	/**
	 * Insert user "scao"
	 */

	db.query(`INSERT IGNORE INTO matcha.users (userId, username, firstName, lastName, age, email, password, tokenmail, mail_active, gender, bio, sexpref, geoloc, position, lastConnection) VALUES (1, 'scao', 'Sandrine', 'Cao', 31, 'scao@student.42.fr', 'sha1$e32b5a1e$1$b68f3acc8dd026a949ed056e10454884f5ebe923', '8f2f4683bb8e6ce8b2a3975805d7e87c', 1, 'Woman', 'Ma bio', 'Homosexual', '48.8823464, 2.3118558', '', 'Mar 7, 2020');`,
		function (err) {
			if (err) throw err;
		});

	db.query(`create table if not exists matcha.blocks(
		id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
		userId int(11) NOT NULL,
		targetId int(11) NOT NULL
	);`, function (err) {
		if (err) throw err;
	});


	/**
	 * Create Table "Images"
	 */
	db.query(`create table if not exists matcha.images(
		id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
		name varchar(256) NOT NULL,
		userId int(11) NOT NULL,
		profil int(11) NOT NULL DEFAULT 0
	);`, function (err) {
		if (err) throw err;
	});

	/**
	 * Insert into "Images" for user "scao"
	 */
	db.query(`INSERT IGNORE INTO matcha.images (id, name, userId, profil) VALUES
	(1, '/static/gallery/scao/scao_1583581917654', 1, 1);`, function (err) {
		if (err) throw err;
	});

	/**
	 * Create Table "Likes"
	 */

	db.query(`create table if not exists matcha.likes(
		id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
		userId int(11) NOT NULL,
		targetId int(11) NOT NULL
	);`, function (err) {
		if (err) throw err;

	});

	/**
	 * Create Table "Messages"
	 */
	db.query(`create table if not exists matcha.messages(
		id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
		senderId int(11) NOT NULL,
		receiverId int(11) NOT NULL,
		message varchar(600) NOT NULL
		);`, function (err) {
		if (err) throw err;
	});

	/**
	 * Create Table "Notifications"
	 */
	db.query(`create table if not exists matcha.notifications(
		id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
		userId int(11) NOT NULL,
		targetId int(11) NOT NULL,
		eventName varchar(50) NOT NULL,
		status int(11) NOT NULL DEFAULT 0
	);`, function (err) {
		if (err) throw err;
	});

	/**
	 * Create Table "Tags"
	 */
	db.query(`create table if not exists matcha.tags(
		tagId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
		name varchar(70) NOT NULL
	);`, function (err) {
		if (err) throw err;
	});


	/**
	 * Insert into Table "Tags"
	 */
	db.query(`INSERT IGNORE INTO matcha.tags (tagId, name)
	VALUES ('1', '#animals'), ('2', '#astrology'), ('3', '#cycling'), ('4', '#technology'), ('5', '#gaming'), ('6', '#programming'), ('7', '#concerts'), ('8', '#theatre'), ('9', '#cooking'), ('10', '#running') ;`,
		function (err) {
			if (err) throw err;
		});

	/**
	 * Create Table "User_tags"
	 */
	db.query(`create table if not exists matcha.user_tags(
		userId int(11) NOT NULL,
		tagId int(11) NOT NULL
		);`, function (err) {
		if (err) throw err;
	});
});

/**
 * Insert into Table "Tags" for user "scao"
 */
// db.query(`INSERT INTO matcha.user_tags (userId, tagId) VALUES
// 	(1, 4),
// 	(1, 5),
// 	(1, 7);`,
// 	function (err) {
// 		if (err) throw err;
// 	});

module.exports = db;