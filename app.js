const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./route_handlers/errorHandler');
const tourRouter = require('./routes/tourRoutes');
const gig = require('./routes/gigRoutes');

const app = express();

// MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // prints readable req messages in console
}

// get access to the request body of a request object
app.use(express.json()); // body parser

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES
// route mounting
app.use('/api/v1/tours', tourRouter);
app.use('/gigs', gig);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
