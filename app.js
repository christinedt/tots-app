// set variables for the environment
var express = require('express'),
    app = require('express')(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    path = require('path'),
    fs = require('fs'),
    ext = require('extjs-node'),
    publicDir = process.argv[2] || __dirname + '/public',
    hostname = process.env.HOSTNAME || 'localhost';

//views directory for all template files
app.set('port', (process.env.PORT || 4000));


app.set('views', path.join(publicDir, '/views'));
app.set('view engine', 'ejs');
app.set('view options', { basedir: process.env.__dirname});
//instruct express to server up static assets
app.use(express.static(path.join(__dirname, 'public')));


//set routes
app.get('/', function(req, res) {
	res.sendFile(path.join(publicDir, '/views/index.html'));
});

// Set server port
server.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});

io.on('connection', function (socket) {
	console.log('new client: ' + socket.id);
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
  socket.on('disconnect', function(data) {
    console.log("Client has disconnected " + data);
  });
});

// function handleRequest(req, res) {
//   // What did we request?
//   var pathname = req.url;

//   // If blank let's ask for index.html
//   if (pathname == '/') {
//     pathname = '/index.html';
//   }

//   // Ok what's our file extension
//   var ext = path.extname(pathname);

//   // Map extension to file type
//   var typeExt = {
//     '.html': 'text/html',
//     '.js':   'text/javascript',
//     '.css':  'text/css'
//   };

//   // What is it?  Default to plain text
//   var contentType = typeExt[ext] || 'text/plain';

//   // Now read and write back the file with the appropriate content type
//   fs.readFile(__dirname + pathname,
//     function (err, data) {
//       if (err) {
//         res.writeHead(500);
//         return res.end('Error loading ' + pathname);
//       }
//       // Dynamically setting content type
//       res.writeHead(200,{ 'Content-Type': contentType });
//       res.end(data);
//     }
//   );
// }
