// Initialize the API Express Router and the actual routes to each API
const router = require('express').Router();
const userRoutes = require('./userRoutes');
const projectRoutes = require('./projectRoutes');

// Further defining the URI path, by tethering the routes
router.use('/users', userRoutes);
router.use('/projects', projectRoutes);

// Export the router object
module.exports = router;
