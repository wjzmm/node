var mongodb = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/test) 
/*db.open(function(error, client){
	if (!error){
		console.log("connect")
	}else{
		console.log("connect failed")
	}
	var collection = new mongodb.Collection('client', 'user');
	collection.find(function(error, cursor){
		cursor.each(function(error, doc){
			if(doc){
				console.log("name:" + doc.name + "age:" + doc.age );
			}
		});
	});*/
});
