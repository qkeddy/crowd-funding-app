// Initialize Express.js router object
const router = require('express').Router();

// Initialize route to home path (./)
const homeRoutes = require('./homeRoutes');

// Initialize route to API path (./api/index.js)
const apiRoutes = require('./api');

// Open the route by defining the URI path to "/api"
router.use('/', homeRoutes);
router.use('/api', apiRoutes);

// Export the router object
module.exports = router;
