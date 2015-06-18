var mongodb = require('mongodb');
var server = new mongodb.Server('127.0.0.1', 27017, {auto_reconnect: true});

var db = new mongodb.Db('test', server, {safe: true});

db.open(function(error, client){
	if (!error){
		console.log("connect")
	}else{
		console.log("connect failed")
	}
/*	var collection = new mongodb.Collection('client', 'user');
	collection.find(function(error, cursor){
		cursor.each(function(error, doc){
			if(doc){
				console.log("name:" + doc.name + "age:" + doc.age );
			}
		});
	});*/
});
