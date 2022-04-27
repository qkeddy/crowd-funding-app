// Initialize Express.js router object
const router = require('express').Router();

// Import references to the route models
const { Project, User } = require('../models');

const withAuth = require('../utils/auth');

// GET all projects
router.get('/', async (req, res) => {
    try {
        // Get all projects and JOIN with user data
        const projectData = await Project.findAll({
            // Include projects by user and get just the name field (attribute)
            include: [
                {
                    model: User,
                    attributes: ['name']
                }
            ]
        });

        // Serialize data so the template can read it. Map over the array of sequelize objects that need to be serialized.
        const projects = projectData.map((project) =>
            project.get({ plain: true })
        );

        // Pass serialized project data and user logged in session flag into a Handlebars template
        res.render('homepage', {
            projects,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET a project based upon parameter variable
router.get('/project/:id', async (req, res) => {
    try {
        console.log('got here');
        // Find project by primary key and include the User and name field
        const projectData = await Project.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['name']
                }
            ]
        });

        // Serialize a single project from the Sequelize object to key:value pairs
        const project = projectData.get({ plain: true });

        // Need to wrap in braces because the output of the spread operator includes multiple component. Only use the spreader when trying to combine with another object. In this case, we are trying to combine with the log in object.
        // console.log('SPREADER', { ...project });
        // console.log('SPREADER', project);

        // DONE Question - how is the spreader working
        // Rendering the project by spreading it (make a copy of the object) for use in the project Handlebars template
        res.render('project', {
            // Combine the project object into a bigger object that is being passed as an option in the render function. Any object with the included key:value pairs. Basically, combining two objects into one larger object
            ...project,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET profile
// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
    try {
        // Find the logged in user based on the session ID
        const userData = await User.findByPk(req.session.user_id, {
            // Never want to include a keyed in password
            // DONE how would password even be coming through this object?
            // Password is being filtered out of the userData object that is being returned
            attributes: { exclude: ['password'] },
            include: [{ model: Project }]
        });

        console.log(userData);

        const user = userData.get({ plain: true });

        // DONE Question - how is the spreader working... see above
        res.render('profile', {
            ...user,
            logged_in: true
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET Login
router.get('/login', (req, res) => {
    // If the user is already logged in, redirect the request to another route
    if (req.session.logged_in) {
        res.redirect('/profile');
        return;
    }
    // Otherwise, render the login Handlebars template
    res.render('login');
});

module.exports = router;
