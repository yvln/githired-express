// require packages and set up variables
const express = require('express'),
      logger = require('morgan'),
      app = express(),
      bodyParser = require('body-parser'),
      port = process.env.PORT || 3000,
      Auth = require('./services/auth'),
      cors = require('cors')

require('dotenv').config();
// use cors so we can talk to our other server
app.use(cors());

// body parser to get form data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// logger to see whats going on
app.use(logger('dev'));

// before all routes, use the middleware we define in Auth to get the
// current user
app.use(Auth.authenticate);

// set up base routes
app.use('/users', require('./controllers/users_controller'));
app.use('/login', require('./controllers/sessions_controller'));
app.use('/gitHired', require('./controllers/gitHired'));

// listen on port and run server
app.listen(port, () => console.log('server listening on ' + port));
