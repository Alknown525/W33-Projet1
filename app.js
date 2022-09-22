var express = require('express');
// C'est un framework pour NodeJS
var path = require('path');
// C'est un module qui fournit des outils pour travailler avec les fichiers et les répertoires
var cookieParser = require('cookie-parser');
// C'est un module pour travailler avec les cookies
var logger = require('morgan');
// C'est un "HTTP request level Middleware" 

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'), {"index": "Projet1.htm"}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
