var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var fs = require('fs-extra');

var config = require('./config/config');

// uncomment when db_url defined in config script
mongoose.connect(config.db_url);
var Watch = require('./app/models/watch');
var User = require('./app/models/user');
var NewsPost = require('./app/models/newspost');
var CalendarElement = require('./app/models/calendarelement');
var PressPhoto = require('./app/models/pressphoto');

// define Mongoose Models here

//var routes = require('./routes/index');
var api = require('./routes/api');
var auth = require('./routes/auth');
var dashboard = require('./routes/dashboard');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.set('tokenKey', config.secret);

//uncomment when favicon.ico placed in public folder
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// allow CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
});

//app.use('/', routes);
app.use('/api', api);
app.use('/auth', auth);
app.use('/dashboard', dashboard);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
      res.status(err.status || 500).send({ message: err.message });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500).send({ message: err.status });
});


module.exports = app;
