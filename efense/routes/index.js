var express = require('express');
var router = express.Router();
var save = require('../dao/save')
var read = require('../dao/read')

/* GET home page. */
router.get('/', function(req, res, next) {
  var uname = "ire";
	var upwd = "664";
	
	// save.saveUser(uname, upwd, function(err){
	// 	res.send({
	// 		'status': 'ok',
	// 		'msg': 'response ok, from server'
	// 	});
	// });
});

router.post('/reg', function(req, res){
	var uname = req.body.uname;
	var upwd = req.body.passwd;
	// var uname = "uname";
	// var upwd = "passwd";
	save.saveUser(uname, upwd, function(err){
		res.send({
			'status': 'ok',
			'msg': 'response ok, from server'
		});
	});
	
});

router.post('/login', function(req, res){
	var uname = req.body.uname;
	var upwd = req.body.passwd;
	read.isAllowedLogin(uname, upwd, function(result){
		console.log();
		if(result[0] != undefined){
			res.send("exist");
		} else {
			res.send("no exist");
		}
	});
});

router.get('/getfense', function(req, res){
	var fense_id = req.body.fenseid;
	read.readEfenseInfo(fense_id, function(result){
		console.log();
		if(result[0] != undefined){
			res.send("exist");
		} else {
			res.send(result[0]);
		}
	});
});
module.exports = router;
