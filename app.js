﻿var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');


var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());
// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Helpers dinamicos:
app.use(function(req, res, next) {

  // si no existe lo inicializa
  if (!req.session.redir) {
    req.session.redir = '/';
  }
  // guardar path en session.redir para despues de login
  if (!req.path.match(/\/login|\/logout|\/user/)) {
    req.session.redir = req.path;
    console.log("EALBUTR req.path = " + req.path);
  }

	//Validar session timeout
	if (req.session.user) {
		if (Date.now() - req.session.user.lastRequestTime > 2*60*1000) {
			delete req.session.user;
			var errors = req.session.errors || 'Sesión caducada ...';
			req.session.errors = {};
			
			// Hacer visible req.session en las vistas
  		res.locals.session = req.session;
  
			res.render('sessions/new', {errors: errors});
			
		} else {
			req.session.user.lastRequestTime = Date.now();
			// Hacer visible req.session en las vistas
	  	res.locals.session = req.session;
	  	next();
		}
	
	} else {	
	  // Hacer visible req.session en las vistas
	  res.locals.session = req.session;
	  next();
	}
});


app.use('/', routes);

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
