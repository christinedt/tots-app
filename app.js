// set variables for the environment
var express = require('express'),
    ejs = require('ejs'),
    jade = require('jade'),
    app = express(),
    session =require('express-session'),
    server = require('http').Server(app),
    bodyParser = require('body-parser'),
    io = require('socket.io')(server),
    path = require('path'),
    fs = require('fs'),
    ext = require('extjs-node'),
    publicDir = process.argv[2] || __dirname + '/public',
    hostname = process.env.HOSTNAME || 'localhost',
    sess;

appInit();
// socketsInit();

function appInit() {

  //views directory for all template files
  app.set('port', (process.env.PORT || 4000));
  app.set('views', path.join(publicDir, '/views'));
  app.set('view engine', 'jade');
  app.set('view options', { basedir: process.env.__dirname});

  //
  app.use(function(req,res,next){
      res.locals.session = req.session;
      next();
  });
  app.use(session({resave: true, saveUninitialized: false, secret: 'SOMERANDOMSECRETHERE', cookie: { maxAge: 6000000000 }}));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));

  //instruct express to server up static assets
  app.use(express.static(path.join(__dirname, 'public')));


  //set routes
  app.get('/', function(req, res) {
    sess = req.session;

    sess.sliderSettings = {
      'visible': false,
      'totSlider': 1,
      'diversitySlider': 200,
      'sensitivitySlider': 10,
      'bounceSlider': 1,
      'pairSlider': 1,
      'backgroundSlider': 225,
      'gazeSlider': 1,
      'tensionSlider': 1,
      'bodySlider': 1
    };

    res.render('index', { title: "Index", next_page: "Looking", session: sess });
  });

  app.post('/load',function(req,res){
    sess = req.session;

    sess.selfTotSettings = req.body.selfTotSettings;
    res.end('done');
  });

  app.get('/looking', function(req, res) {
    sess = req.session;

    if(!sess.selfTotSettings){
      res.redirect('/');
    }

    sess.sliderSettings = {
      'totSlider': 13,
      'diversitySlider': 200,
      'sensitivitySlider': 10,
      'bounceSlider': 1,
      'pairSlider': 1,
      'backgroundSlider': 130,
      'gazeSlider': 1,
      'tensionSlider': 0,
      'bodySlider': 1
    };

    res.render('sketch', {
      title: "Looking", 
      next_page: 'grouping', 
      session: sess, 
      poem: 'A lifetime of feeling there\'s no one for you...',
      directive: 'Connect with another'
    });
  });

  app.post('/sketch', function(req, res) {
    sess = req.session;

    sess.selfTotSettings = req.body.selfTotSettings;
    sess.sliderSettings = req.body.sliderSettings;
    res.end('done');
  });

  app.get('/grouping', function(req, res) {
    sess = req.session;

    if(!sess.selfTotSettings){
      res.redirect('/');
    }

    sess.sliderSettings.pairSlider = 0;
    sess.sliderSettings.backgroundSlider = 70;

    res.render('sketch', {
      title: "Grouping", 
      next_page: 'duet', 
      session: sess, 
      poem: '... and a lifetime of finding no one like you...',
      directive: 'Connect with others'
    });
  });

  app.get('/duet', function(req, res) {
    sess = req.session;

    if(!sess.selfTotSettings){
      res.redirect('/');
    }

    sess.sliderSettings.totSlider = 1;
    sess.sliderSettings.pairSlider = 1;
    sess.sliderSettings.tensionSlider = 1;
    sess.sliderSettings.backgroundSlider = 20;

    res.render('sketch', {
      title: "Duet", 
      next_page: 'free_play', 
      session: sess, 
      poem: '...takes only one to undo', 
      directive: 'Be patient'
    });
  });

  app.get('/free_play', function(req, res) {
    sess = req.session;

    if(!sess.selfTotSettings){
      res.redirect('/');
    }

    sess.sliderSettings.totSlider = 15;
    sess.sliderSettings.pairSlider = 1;
    sess.sliderSettings.visible = true;

    res.render('sketch', {
      title: "Free play", 
      next_page: '', 
      session: sess, 
      poem: 'Free Play', 
      directive: 'Free play!'
    });
  });

  // Set server port
  server.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
  });

}

function socketsInit() {

  io.on('connection', function (socket) {
    console.log('new client: ' + socket.id);
    socket.emit('news', { hello: 'world' });

    socket.on('my other event', function (data) {
      console.log(data);
    });

    socket.on('disconnect', function(data) {
      console.log("Client has disconnected " + data);
    });

    socket.on('mouse',
      function(data) {
        // Data comes in as whatever was sent, including objects
        console.log("Received: 'mouse' " + data.x + " " + data.y);      
        // Send it to all other clients
        io.sockets.emit('mouse', data);
      }
    );
  });
}
