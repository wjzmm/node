var spawn = require('child_process').spawn;
var http = require('http');
var querystring = require("querystring");
var uinfo = require("./config").userinfo;

console.log("ras connecting");
var isRasSuccess = false;
spawn('Rasdial', [uinfo.rasname, '/disconnect']);
var rasDial = spawn('Rasdial', [uinfo.rasname, uinfo.uname, uinfo.passwd]);

rasDial.stdout.on('data', function(data){
	console.log(data);
});

rasDial.stderr.on('data', function(data){
	console.log(data);
});

rasDial.on('exit', function(code, signal){
	console.log('child process exit, with code: ' + code);
	if(!code){
		var data = {
			action: "login",
			username: uinfo.uname,
			password: uinfo.passwd,
			ac_id: "1",
			user_ip: "",
			nas_ip: "",
			user_mac: "",
			save_me: "1",
			ajax: "1"
		};
		data = querystring.stringify(data);

		var opt = {
			method: "POST",
			host: "10.6.8.2",
			port: "16800",
			path: "/include/auth_action.php",
			headers: {  
		        "Content-Type": 'application/x-www-form-urlencoded',  
		        "Content-Length": data.length  
		    }  
		}

		var req = http.request(opt, function(res){
			console.log("status code:" + res.statusCode);
			res.setEncoding("utf8");
			res.on('data', function(chunk){
				if(chunk.split(',')[0] == "login_ok"){
					console.log("登陆成功");
				}
			});
		});

		req.write(data + "\n");  
		req.end(); 
	}
})


 

