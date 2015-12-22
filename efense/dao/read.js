var db = require('../config').db;

exports.isAllowedLogin = function(username, password, callback){
	//console.log(searchSql);
	db.query("select * from user where username = ? and password = ?",[username, password],
		function(err, result, fields){
		callback(result); 
	});
}

exports.readEfenseInfo = function(fense_id, callback){
	//console.log(searchSql);
	db.query("select * from user where id = ?",[fense_id],
		function(err, result, fields){
		callback(result); 
	});
}