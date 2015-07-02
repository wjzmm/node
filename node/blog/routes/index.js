var express = require('express');
var router = express.Router();
var crypto = require('crypto'),
	User = require('../models/user.js');

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { title: 'HomePage',
						  user: req.session.user,
						  success: req.flash('success').toString(),
						  error: req.flash('error').toString()
						});
});
router.get('/reg', function(req, res){
	res.render('reg', { title: 'Reg',
						user: req.session.user,
						success: req.flash('success').toString(),
					    error: req.flash('error').toString()
					  });
});
router.post('/reg', function(req, res){
	var name = req.body.name,
		password = req.body.password,
		password_re = req.body['password-repeat'];
	if(password_re != password){
		req.flash('error', '两次输入的密码不一致');
		return res.redirect('/reg');
	}
	var md5 = crypto.createHash('md5'),
		password = md5.update(req.body.password).digest('hex');
	var newUser = new User({
		name: req.body.name,
		password: password,
		email: req.body.email
	});

	User.get(newUser.name, function(err, user){
	
		if(user){
			req.flash('error', '用户名已存在');
			console.log('error1');
			return res.redirect('/reg');
		}
		newUser.save(function(err, user){
			console.log(user+"--1--");
			if(err){
				req.flash('error', err);
				console.log('error2'+err);
				return res.redirect('/reg');
			}
		
			req.session.user = user;
			//console.log(req.session.user+'  --  ||  --  '+user);
			req.flash('success', '注册成功！');
			console.log('success');
			res.redirect('/');
		});
	});
});
router.get('/login', function(req, rest){
	res.render('login', { title: 'Login'});
});
router.post('/login', function(req, res){
});
router.get('/post', function(req, res){
	res.render('post', { title: 'Post'});
});
router.post('/post', function(req, res){
});
router.get('/logout', function(req, res){
});

module.exports = router;
