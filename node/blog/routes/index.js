var express = require('express');
var router = express.Router();
var crypto = require('crypto'),
	User = require('../models/user.js'),
	Post = require('../models/post.js'),
	Comment = require('../models/comment.js'),
	multiparty = require('multiparty'),
	fs = require('fs');

/* GET home page. */
router.get('/', function(req, res) {
	var page = req.query.p ? parseInt(req.query.p) : 1;

	Post.getTen(null, page, function(err, posts, total){
		if(err){
			console.log("error");
			posts = [];
		}
		//console.log(posts.time);
		res.render('index', { title: '主页',
							  user: req.session.user,
							  posts: posts,
							  page: page,
							  isFirstPage: (page - 1) == 0,
							  isLastPage: ((page - 1) * 10 + posts.length) == total,
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
	var form = new multiparty.Form({uploadDir: '../public/images/'});
	form.parse(req, function(err, fields, files){
		var filesTmp = JSON.stringify(files, null, 2);
		if(err){
			console.log('parse error: ' + err);
		}else{
			console.log('parse files: ' + filesTmp);
			for(var i in files){
				var file = files[i];
				console.log(file[0].fieldName);
				if(file[0].size == 0){
					fs.unlinkSync(file[0].path);
					console.log('Successfully removed an empty file!');
				}
				//console.log(file.path);
			    var uploadedPath = file[0].path;
			    //console.log(uploadedPath);
	 	        var dstPath = '../public/images/' + file[0].originalFilename;
	 	        fs.rename(uploadedPath, dstPath, function(err) {
		            if(err){
		            	console.log('rename error: ' + err);
			        } else {
		            	console.log('rename ok');
		 	        }
				});
			}
		}
	});	
	req.flash('success', '文件上传成功！');
	res.redirect('/upload');
});
router.get('/u/:name', function(req, res){
	var page = req.query.p ? parseInt(req.query.p) : 1;
	User.get(req.params.name, function(err, user){
		if(!user){
			req.flash('error', '用户不存在！');
			return res.redirect('/');
		}
		Post.getTen(null, page, function(err, posts, total){
		if(err){
			req.flash('error', err);
			return res.redirect('/');
		}
		//console.log(posts.time);
		res.render('user', { title: user.name,
							  user: req.session.user,
							  posts: posts,
							  page: page,
							  isFirstPage: (page - 1) == 0,
							  isLastPage: ((page - 1) * 10 + posts.length) == total,
							  success: req.flash('success').toString(),
						      error: req.flash('error').toString()
		});
		
	});
	});
});
router.get('/u/:name/:day/:title', function(req, res){

	Post.getOne(req.params.name, req.params.day, req.params.title, function(err, post){
		if(err){
			req.flash('error', err);
			return res.redirect('/');
		}
		res.render('article', {
			title: req.params.title,
			post: post,
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});
});
router.post('/u/:name/:day/:title', function(req, res){
	var date = new Date(),
		time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" +
				(date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
	var comment = {
		name: req.body.name,
		email: req.body.email,
		website: req.body.website,
		time: time,
		content: req.body.content
	};
	var newComment = new Comment(req.params.name, req.params.day, req.params.title, comment);
	newComment.save(function(err){
		if(err){
			req.flash('error', err);
			return res.redirect('back');
		}
		req.flash('success', '留言成功！');
		res.redirect('back');
	});
});
router.get('/edit/:name/:day/:title', checkLogin);
router.get('/edit/:name/:day/:title', function(req, res){
	var currentUser = req.session.user;
	Post.edit(currentUser.name, req.params.day, req.params.title, function(err, post){
		if(err){
			req.flash('error', err);
			return res.redirect('/');
		}
		res.render('edit', {
			title: '编辑',
			post: post,
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});
});

router.post('/edit/:name/:day/:title', checkLogin);
router.post('/edit/:name/:day/:title', function(req, res){
	var currentUser = req.session.user;
	Post.update(currentUser.name, req.params.day, req.params.title, req.body.post, function(err){
		var url = "/u/" + req.params.name + "/" + req.params.day + "/" + encodeURIComponent(req.params.title);
		if(err){
			req.flash('error', err);
			return res.redirect(url);
		}
		req.flash('success', '修改成功！');
		res.redirect(url);
	});
});

router.get('/remove/:name/:day/:title', checkLogin);
router.get('/remove/:name/:day/:title', function(req, res){
	var currentUser = req.session.user;
	Post.remove(currentUser.name, req.params.day, req.params.title, function(err, post){
		if(err){
			req.flash('error', err);
			return res.redirect('back');
		}
		req.flash('success', '删除成功！');
		res.redirect('/');
	});
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
