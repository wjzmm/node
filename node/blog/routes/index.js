var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});
router.get('/reg', function(req, res, next){
	res.render('reg', { title: '×¢²á'});
});
router.post('/reg', function(req, res, next){
});
router.get('/login', function(req, res, next){
	res.render('login', { title: 'µÇÂ½'});
});
router.post('/login', function(req, res, next){
});
router.get('/post', function(req, res, next){
	res.render('post', { title: '·¢±í'});
});
router.post('/post', function(req, res, next){
});
router.get('/logout', function(req, res, next){
});

module.exports = router;
