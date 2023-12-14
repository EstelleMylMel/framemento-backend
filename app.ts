require('dotenv').config();
require('./models/connection');
const port = process.env.PORT || 3000;

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var rollsRouter = require('./routes/rolls');
var framesRouter = require('./routes/frames');
var materialRouter = require('./routes/material');

var app = express();

const cors = require('cors');
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/rolls', rollsRouter);
app.use('/frames', framesRouter);
app.use('/material', materialRouter)

app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});
