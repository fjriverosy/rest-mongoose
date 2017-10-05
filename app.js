var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var json2xls = require('json2xls');
var registers = require('./routes/registers');
var app = express();
var cors = require('cors');
var mongoDB= 'mongodb://localhost/RegMEF';
mongoose.connect(mongoDB);

var db = mongoose.connection;

db.on('error', console.error.bind(console,'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors());
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/registers', registers.showAll);
app.get('/registers/name/:name', registers.showByName);
app.get('/registers/exactname/:name', registers.showByExactName);
app.get('/registers/namelimited/:name', registers.showByNameLimited);
app.get('/registers/dni/:dni', registers.showByDNI);
app.get('/registers/dnilimited/:dni', registers.showByDNILimited);
app.get('/registers/exportdnixls/:dni', registers.exportdnixls);
app.get('/registers/exportnamexls/:name',registers.exportnamexls);
//app.get('/registers/exportxlsexample', registers.exportxls);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.listen(9000);
module.exports = app;
