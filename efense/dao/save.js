var db = require('../config').db;

exports.saveUser = function(username, password, callback){
	var time = new Date(+new Date()+8*3600*1000).toISOString().slice(0, 19).replace('T', ' ');
	console.log(time);
	db.query("insert into user(username, password, time) values (?, ?, ?)", 
		[username, password, time], function(err, data){
		if (err) console.log(err);
		callback(null);
	});
}

exports.saveFense = function(id, range, diff, callback){
	var time = new Date(+new Date()+8*3600*1000).toISOString().slice(0, 19).replace('T', ' ');
	console.log(time);
	db.query("insert into fense(id, range, diff, time) values (?, ?, ?, ?)", 
		[id, range, diff, time], function(err, data){
		if (err) console.log(err);
		callback(null);
	});
}

exports.joinFense = function(fense_id, callback){
	var time = new Date(+new Date()+8*3600*1000).toISOString().slice(0, 19).replace('T', ' ');
	console.log(time);
		//insert into abcxyz(time, content) values(?, ?) ON DUPLICATE KEY update keywordv=keywordv+1
	db.query("update user set fense_id = ? where username = ?", 
		[fense_id, username], function(err, data){
		if (err) console.log(err);
		callback(null);
	});
}