var mysql = require('mysql');

var db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '123456'
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
	 * Create Table "Blocks"
	 */
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

module.exports = db;