var mysql = require('mysql');

exports.db = mysql.createConnection({
	host: '127.0.0.1',
	port: 3306,
	database: 'efense',
	user: 'root',
	password: '920902',
});
