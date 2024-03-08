// Create web server
// 1. Create a server
// 2. Create a request handler
// 3. Assign the request handler to the server
// 4. Start the server

var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var comments = require('./comments');

var server = http.createServer(function(req, res) {
	var urlPath = url.parse(req.url).pathname;
	var filePath = path.join(__dirname, urlPath);
	
	if (urlPath === '/comments' && req.method === 'GET') {
		comments.get(req, res);
	} else if (urlPath === '/comments' && req.method === 'POST') {
		comments.post(req, res);
	} else {
		fs.stat(filePath, function(err, fileInfo) {
			if (err) {
				res.statusCode = 404;
				res.end('File not found');
				return;
			}
			
			if (fileInfo.isFile()) {
				fs.createReadStream(filePath).pipe(res);
			} else {
				res.statusCode = 403;
				res.end('Directory access is forbidden');
			}
		});
	}
});

server.listen(3000);
console.log('Server started on localhost:3000; press Ctrl-C to terminate....');