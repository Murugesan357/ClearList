var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require("body-parser");
var cors = require('cors')
const models = require('./models')
const passport = require("passport");
const CommonService = require('./services/common.service')
require('./middleware/passport')(passport);

var app = express();

app.use(
  cors({
    origin: "http://localhost:8000",
    credentials: true
  })
);
 // support parsing of application/json type post data
 app.use(bodyParser.json({ limit: "200mb" }));
 //support parsing of application/x-www-form-urlencoded post data
 app.use(bodyParser.urlencoded({ extended: true, limit: "200mb", parameterLimit: 50000 }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

app.use(async function (req,res,next){
  if(req && req.headers && req.headers.authorization){
    const accessToken = CommonService.decryptDetails(req.headers.authorization);
      req.headers.authorization = accessToken;
  }
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, OPTIONS, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  next();
});

//db connection
models.sequelize
  .authenticate()
  .then(()=>{
    console.log("Connected to SQL database: ",CONFIG.db_name);
    const schema = models.schemaCreate.then(()=>{
      models.sequelize.sync({alter:true})
    })
  })
  .catch((err) => {
    console.error("unable to connect to Postgres database:",
    CONFIG.db_name,
    err.message
    );
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

app.use('/api/users', require('./controllers/users/user.controller').router);
app.use('/api/todos', require('./controllers/todo/todo.controller').router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


module.exports = app;
