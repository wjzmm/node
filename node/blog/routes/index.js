var express = require('express');
var router = express.Router();
var crypto = require('crypto'),
	User = require('../models/user.js'),
	Post = require('../models/post.js'),
	multiparty = require('multiparty'),
	fs = require('fs');

/* GET home page. */
router.get('/', function(req, res) {
	Post.get(null, function(err, posts){
		if(err){
			console.log("error");
			posts = [];
		}
		console.log(posts.time);
		res.render('index', { title: '主页',
							  user: req.session.user,
							  posts: posts,
							  success: req.flash('success').toString(),
						      error: req.flash('error').toString()
		});
		
	});
});

router.get('/reg', checkNotLogin);
router.get('/reg', function(req, res){
	res.render('reg', { title: '注册',
						user: req.session.user,
						success: req.flash('success').toString(),
					    error: req.flash('error').toString()
					  });
});

router.post('/reg', checkNotLogin);
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
		//	console.log(req.session.user+'  --  ||  --  '+user);
			req.flash('success', '注册成功！');
			console.log('success');
			res.redirect('/');
		});
	});
});

router.get('/login', checkNotLogin);
router.get('/login', function(req, res){
	res.render('login', { title: '注册',
						  user: req.session.user,
						  success: req.flash('success').toString(),
					      error: req.flash('error').toString()});
});

router.post('/login', checkNotLogin);
router.post('/login', function(req, res){
	var md5 = crypto.createHash('md5'),
		password = md5.update(req.body.password).digest('hex');
	User.get(req.body.name, function(err, user){
		if(!user){
			req.flash('error', '用户不存在！');
			return res.redirect('/login');
		}
		if(user.password != password){
			req.flash('error', '密码错误');
			return res.redirect('/login');
		}
		req.session.user = user;
		req.flash('success', '登陆成功！');
		res.redirect('/');

	});
});

router.get('/post', checkLogin);
router.get('/post', function(req, res){
	res.render('post', { title: '注册',
				  user: req.session.user,
				  success: req.flash('success').toString(),
			      error: req.flash('error').toString()
	});
});

router.post('/post', checkLogin);
router.post('/post', function(req, res){
	var currentUser = req.session.user,
		post = new Post(currentUser.name, req.body.title, req.body.post);
	//console.log(currentUser.name);
	post.save(function(err){
		if(err){
			req.flash('error', err);
			return res.redirect('/');
		}
		req.flash('success', '发布成功！');
		res.redirect('/');
	});
});

router.get('/logout', checkLogin);
router.get('/logout', function(req, res){
	req.session.user = null;
	req.flash('success', '登出成功！');
	res.redirect('/');
});
router.get('/upload', checkLogin);
router.get('/upload', function(req, res){
	res.render('upload',{
		title: '文件上传',
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	})
});
router.post('/upload', checkLogin);

router.post('/upload', function(req, res){
	console.log('uploading................');
	var form = new multiparty.From({uploadDir: './public/images/'});
	form.parse(req, function(err, fields, files){
		var filesTmp = JSON.querystring.stringify(files, null, 2);

		if(err){
			console.log('parse error: ' + err);
		}else{
			console.log('parse files: ' + filesTmp);
			var inputFile = files.inputFile[0];
		    var uploadedPath = inputFile.path;
 	        var dstPath = './public/images/' + inputFile.originalFilename;
 	        fs.rename(uploadedPath, dstPath, function(err) {
	            if(err){
	            	console.log('rename error: ' + err);
		        } else {
	            	console.log('rename ok');
	 	        }
			});
		}
	});	
	req.flash('success', '文件上传成功！');
	res.redirect('/upload');
});
/* power control*/
function checkLogin(req, res, next){
	if(!req.session.user){
		req.flash('error', '未登录！');
		res.redirect('/login');
	}
	next();
}
function checkNotLogin(req, res, next){
	if(req.session.user){
		req.flash('error', '已登录！');
		res.redirect('back');
	}
	next();
}
module.exports = router;
