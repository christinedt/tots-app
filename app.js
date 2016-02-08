// set variables for the environment
var express = require('express');
var app = express();
var path = require('path');


//set routes
app.get('/', function(req, res) {
	res.render('index');
});

// Set server port
app.listen(4000);
console.log('server is runnin');

//views directory for all template files
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//instruct express to server up static assets
app.use(express.static('public'));