const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const flash = require("connect-flash");
const session = require("express-session");
var cookieParser = require('cookie-parser')
const uploads = require('./routes/Upload');
const connectDB = require('./config/db');
const files = require('./routes/Files');
const views = require('./routes/Views');
const users = require('./routes/User');


dotenv.config({
    path:'./config/config.env'
});

connectDB();

const app = express();
app.use(cookieParser());
app.set('view engine','ejs');
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
// Express session
app.use(
    session({
      secret: "secret",
      resave: true,
      saveUninitialized: true,
    })
  );

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});


app.use('/videotube',views);
app.use(express.static(__dirname+'/public'))
app.use('/api/v1/uploads',uploads);
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use('/api/video',files);
app.use('/api/v1/users',users);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT,console.log(`Server Running On Port:${PORT}`.bgYellow.black.bold));
