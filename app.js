// set variables for the environment
var express = require('express');
var app = express();
var path = require('path');

//views directory for all template files
app.set('port', (process.env.PORT || 4000));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//instruct express to server up static assets
app.use(express.static('public'));


//set routes
app.get('/', function(req, res) {
	res.render('index');
});

// Set server port
app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});