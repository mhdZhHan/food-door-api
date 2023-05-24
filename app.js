var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

const cors = require('cors')

// routes
var indexRouter = require('./routes/index')
var authRouter = require('./routes/api/v1/auth')
var userRouter = require('./routes/api/v1/auth/user.route')

// services (mongodb connection)
const MongoDb = require('./services/mongodb.service')
MongoDb.connectToMongoDb() // db connection

// express inistance
var app = express()

app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('static'));


// coustom middlewares
app.use('*', require('./middleware/tockenVerification').tockenVerification)
// routes
app.use('/', indexRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
