// set variables for the environment
var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var fs = require('fs');
var ext = require('ext');

//views directory for all template files
app.set('port', (process.env.PORT || 4000));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//instruct express to server up static assets
app.use(express.static('public'));


//set routes
app.get('/', function(req, res) {
	fs.readFile(__dirname + '/index.html',
    // Callback function for reading
    function (err, data) {
      // if there is an error
      if (err) {
        res.writeHead(500);
        return res.end('Error loading index.html');
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
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
