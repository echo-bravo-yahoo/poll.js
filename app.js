var express = require('express');
var path = require('path');
var passport = require('passport');
var flash = require('connect-flash');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var util = require('util');
var LocalStrategy = require('passport-local').Strategy;

// Database
var mongo = require('mongoskin');
// Use the remote mongo database if available (i.e., app is heroku hosted), else use the local one named 'polljs'
if(typeof process.env.MONGOLAB_URI !== 'undefined') {
    console.log(process.env.MONGOLAB_URI);    
}
var db = mongo.db(process.env.MONGOLAB_URI || "mongodb://localhost:27017/polljs", {native_parse:true});

var users = require('./routes/users');
var test = require('./routes/test');
var transientlogin = require('./routes/transient-login');
var pollindex = require('./routes/pollindex');
var pollroute = require('./routes/pollroute');
var poll = require('./routes/poll');

// In prior versions of Express, this was a call express.createServer();
// To support https, this will have to change.
//WARN: Support HTTPS by changing this as per:
//https://github.com/strongloop/express/wiki/Migrating-from-2.x-to-3.x
//http://www.hacksparrow.com/express-js-https.html
//http://stackoverflow.com/questions/5998694/how-to-create-an-https-server-in-node-js
//http://docs.nodejitsu.com/articles/HTTP/servers/how-to-create-a-HTTPS-server
//http://stackoverflow.com/questions/11744975/enabling-https-on-express-js
var app = express();

var exists_list = {};

var build_min_list = require('./bin/build_min_list.js')

var passin = build_min_list.build(exists_list);

console.log(exists_list);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
//app.use(express.methodOverride()); // what does this do? tutorial for passport.js used it
app.use(express.session({secret: 'i\'m so fucking confused'})) // WARN: this secret is bad. research this function
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  res.locals.expose = {exists: passin};
  // you could alias this as req or res.expose
  // to make it shorter and less annoying
  next();
});

app.use(function(req, res, next){
    req.db = db;
    next();
})

// Readings to understand passport.js
// http://toon.io/understanding-passportjs-authentication-flow/
// https://github.com/jaredhanson/passport-local/blob/master/examples/express3/app.js
app.use(flash());
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

app.use('/', pollindex);
app.use('/users', users);
app.use('/test', test);
app.use('/transient-login', transientlogin);
app.use('/polls', pollindex);
app.use('/pollroute', pollroute);
app.use('/poll', poll);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    //console.log(util.inspect(req.url.slice(-3)));
    var err = new Error('Not Found\n'+'req: '+req.originalUrl);
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;