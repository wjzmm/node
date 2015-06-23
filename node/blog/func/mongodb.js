var mongodb = require('mongoose');
var db = mongoose.createConnection('mongodb://127.0.0.1:27017/test');

db.on("error", function(error){
	console.log(error);
});

var mongooseSchema = new mongoose.Schema({
	username : { type : String, default : "chaochao"},
	age      : { type : Number}
});
mongooseSchema.methods.findByUserName = function(username, callback){
	return this.model('mongoose').find({username: username}, callback);
}
mongooseSchema.methods.findByAge = function(age, callback){
	return this.model('mongoose').find({age: age}, callback);}
var mongooseModel = db.model('mongoose', mongooseSchema);
var doc = {username : 'wang', age : 25};
var mongooseEntity = new mongooseModel(doc);
mongooseEntity.save(function(error){
	if(error){
		console.log(error);
	}else{
		console.log('saved successfully');
	}
	db.close();
});
mongooseModel.update(conditions, update, options, callback);
var conditions = {username: 'zhang'};
var update = {$set: {age: 20}};
var options = {upsert: true};
mongooseModel.update(conditions, update, options, function(error){
	if(error){
		console.log(error);
	}else{
		console.log("update success");
	}
	db.close();
});
var criteria = {username: 'zhang'};
var fields = {age: 1};
var options = {};
mongooseModel.find(criteria, fields, options, function(error, result){
	if(error){
		console.log(error);
	}else{
		console.log(result);
	}
	db.close();
});
var conditions = {username: wang};
mongooseModel.remove(conditions, function(error){
	if(error){
		console.log(error);
	}else{
		console.log("delete success");
	}
	db.close();
});
