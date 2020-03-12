var mysql = require('mysql');

var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password     : '123456',
  database : 'matcha',
});

module.exports = db;