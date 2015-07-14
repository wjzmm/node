var request = require('request');
var cheerio = require('cheerio');
var debug = require('debug')('spider:update');

debug('读取文章内容');

request('http://blog.sina.com.cn/s/blog_69e72a420102vkds.html', function(err, res){
	if(err){
		return console.log(err);
	}

	var $ = cheerio.load(res.body.toString());

	var tags = [];
	$('.blog_tag h3 a').each(function(){
		var tag =$(this).text().trim();
		if(tag){
			tags.push(tag);
		}
	});
	var content = $('.articalContent').html().trim();
	console.log({tags: tags, content: content});
})