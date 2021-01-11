import createError = require('http-errors');
import express = require('express');
import path = require('path');
import cookieParser = require('cookie-parser');
import logger = require('morgan');
import indexRouter from './routes/index';
import apiRouter from './routes/api';
import * as ApiTypes from './models/types';

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/client', express.static(path.join(__dirname, 'client')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', apiRouter);

// catch 404 and forward to error handler
app.use((_req: any, _res: any, next: (arg0: any) => void) => {
  next(createError(404));
});

// error handler
app.use(
  (
    err: ApiTypes.HttpException,
    req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  }
);

export default app;
