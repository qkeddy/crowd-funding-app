// Require supporting NPM modules
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// Initialize required variables
const path = require('path');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const helpers = require('./utils/helpers');

// Initialize the Express.js server
const app = express();
const PORT = process.env.PORT || 3001;

// Ensure that the dotenv environment variables are available to create a session
require('dotenv').config();

// Create a session object and persist an instance of session of the connection session info. Also, turning on a new storage ('store') to an instance of the database connection. In the event of server hiccups, this session info is stored in the MySQL.
const sess = {
    secret: 'Super secret secret',
    // Various cookie settings (key:value) can be added here such as cookie max age
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};
// Invoke session middleware and takes in the specific session object
app.use(session(sess));

// Set up Handlebars.js engine with custom helpers
const hbs = exphbs.create({ helpers });

// Inform Express.js on which template engine to use
app.engine('handlebars', hbs.engine);
// NOTE: the extension of any handlebars templates needs to be "handlebars"
app.set('view engine', 'handlebars');

// Invoke helper middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Turn on routes
app.use(routes);

// Sync sequelize models to the database, then turn on the server
// Force true will drop tables that do not exist. Used for a clean empty database
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});
