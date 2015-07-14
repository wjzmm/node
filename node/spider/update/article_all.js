var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var debug = require('debug')('spider:update');



function readArticleList(url, callback){
	debug('读取全部文章列表');
	request(url, function(err, res){
		if(err){
			return console.log(err);
		}

		var $ = cheerio.load(res.body.toString());

		var articleList = [];
		$('.articleList .articleCell').each(function(){
			var $me =$(this);
			var $title = $me.find('.atc_title a');
			var $time = $me.find('.atc_tm');
			var item = {
				title: $title.text().trim(),
				url: $title.attr('href'),
				time: $time.text().trim()
			};
			var s = item.url.match(/blog_([a-zA-Z0-9]+)\.html/);
			if(Array.isArray(s)){
				item.id = s[1];
				articleList.push(item);
			}
		});
		callback(null, acticleList);
	});
}

function readArticleDetail(url, callback){
	debug('读取博文内容: %s', url);
	request(url, fuction(err, res){
		if(err){
			return callback(err);
		}
		var $ =cheerio.load(res.body.toString());
		var tags = [];
		$('.blog_tag h3 a').each(function(){
			var tag =$(this).text().trim();
			if(tag){
				tags.push(tag);
			}
		});
		var content = $('.articalContent').html().trim();
		callback(null, {tags: tags, content: content});
	});
}
function readArticleList(http://blog.sina.com.cn/s/articlelist_1776757314_0_1.html/, callback){
	request(url, function(err, res){
		if(err){
			return console.log(err);
		}

		var $ = cheerio.load(res.body.toString());

		var articleList = [];
		$('.articleList .articleCell').each(function(){
			var $me =$(this);
			var $title = $me.find('.atc_title a');
			var $time = $me.find('.atc_tm');
			var item = {
				title: $title.text().trim(),
				url: $title.attr('href'),
				time: $time.text().trim()
			};
			var s = item.url.match(/blog_([a-zA-Z0-9]+)\.html/);
			if(Array.isArray(s)){
				item.id = s[1];
				articleList.push(item);
			}
		});
		var nextUrl = $('.SG_pgnext a').attr('href');
		if(nextUrl){
			readArticleList(nextUrl, function(err, articleList2){
				if(err){
					return callback(err);
				}
				callback(null, articleList.concat(articleList2));
			});
		}else{
			callback(null, articleList)
		}
	});
}
readArticleList('http://blog.sina.com.cn/s/articlelist_1776757314_0_1.html/', function(err, articleList){
	if(err){
		console.log(err.stack);
	}
	console.log(articleList);
})