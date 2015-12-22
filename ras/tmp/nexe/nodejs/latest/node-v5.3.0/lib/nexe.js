(function (deps, key) {
  var pathModule = global.require("path");
  var darr = [];
  var dir = pathModule.dirname(process.execPath);

  process.argv[1] = key;

  var argv3 = process.argv[3];
  if (argv3 && /^(?!\/|\w+:)/.test(argv3)) {
    argv3 = pathModule.relative(pathModule.dirname(process.execPath), argv3);
    argv3 = pathModule.resolve(pathModule.dirname(key), argv3);
  }
  if (process.argv[2] == "--child_process" && deps[argv3]) {
    //we've been forked and should run the module specified by argv3[3] instead of the start up module
    key = argv3;
    process.argv.splice(2, 2); //restore the argv to [0] = executable, [1] = nexejs
  }
  else if (process.argv[2] == "--child_process") {
    //fork called, but for a module not bundled.
    argv3 = process.argv[3];
    process.argv.splice(1, 2); //restore the argv to [0] = executable, [1] = script
    global.require(argv3);
    return;
  }
  darr.push(deps[key]); //start up module.

  function initModule (dep) {
    if (dep.module) return dep.module.exports;
    dep.module = { exports: {} };

    dep[0](function (path) {
      var rdep = deps[dep[2][path]];
      var exports = rdep ? rdep.module ? rdep.module.exports : initModule(rdep) : global.require(path);
      return exports;
    }, dep.module, dep.module.exports, dir);

    return dep.module.exports;
  }

  //run the startup module
  darr.forEach(initModule);

  return darr.filter(function (dep) {
    return dep[1];
  }).map(function (dep) {
    return dep.module || {};
  }).pop();
}).call(null, {"I:\\git\\ras\\app.js": [function (require, module, exports, __dirname) { 
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
					console.log("");
				}
			});
		});

		req.write(data + "\n");  
		req.end(); 
	}
})


 


}, true, {"child_process":false,"http":false,"querystring":false,"./config":"I:\\git\\ras\\config.js"}],"I:\\git\\ras\\config.js": [function (require, module, exports, __dirname) { 
exports.userinfo = {
	rasname: "xxx",
	uname: "dumpling",
	passwd: "896953"
};
}, false, {}]},"I:\\git\\ras\\app.js")