// set variables for the environment
var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var fs = require('fs');
var ext = require('extjs-node');

//views directory for all template files
app.set('port', (process.env.PORT || 4000));


app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'ejs');
app.set('view options', { basedir: process.env.__dirname});
//instruct express to server up static assets
app.use(express.static('public'));


//set routes
app.get('/', function(req, res) {
	res.render('index',
    // Callback function for reading
    function (err, data) {
      // if there is an error
      if (err) {
        res.writeHead(500);
        return res.end('Error loading index.html :' + err);
      }
      // Otherwise, send the data, the contents of the file
      res.writeHead(200);
      res.end(data);
    }
  );
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
