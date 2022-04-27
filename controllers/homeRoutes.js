// Initialize Express.js router object
const router = require("express").Router();

// Import references to the route models
const { Project, User } = require("../models");

const withAuth = require("../utils/auth");

// GET all projects
router.get("/", async (req, res) => {
    try {
        // Get all projects and JOIN with user data
        const projectData = await Project.findAll({
            // Include projects by user and get just the name field (attribute)
            include: [
                {
                    model: User,
                    attributes: ["name"],
                },
            ],
        });

        // Serialize data so the template can read it. Map over the array of sequelize objects that need to be serialized.
        const projects = projectData.map((project) => project.get({ plain: true }));

        // Pass serialized project data and user logged in session flag into a Handlebars template
        res.render("homepage", {
            projects,
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET a project based upon parameter variable
router.get("/project/:id", async (req, res) => {
    try {
        // Find project by primary key and include the User and name field
        const projectData = await Project.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ["name"],
                },
            ],
        });

        // Serialize a single project from the Sequelize object
        const project = projectData.get({ plain: true });

        console.log(...project);

        // TODO Question - how is the spreader working
        // Rendering the project by spreading it (make a copy of the object) for use in the project Handlebars template
        res.render("project", {
            ...project,
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET profile
// Use withAuth middleware to prevent access to route
router.get("/profile", withAuth, async (req, res) => {
    try {
        // Find the logged in user based on the session ID
        const userData = await User.findByPk(req.session.user_id, {
            // Never want to include a keyed in password
            // TODO how would password even be coming through this object? 
            attributes: { exclude: ["password"] },
            include: [{ model: Project }],
        });

        const user = userData.get({ plain: true });

        // TODO Question - how is the spreader working
        res.render("profile", {
            ...user,
            logged_in: true,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET Login
router.get("/login", (req, res) => {
    // If the user is already logged in, redirect the request to another route
    if (req.session.logged_in) {
        res.redirect("/profile");
        return;
    }
    // Otherwise, render the login Handlebars template
    res.render("login");
});

module.exports = router;
