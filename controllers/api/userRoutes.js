// Initialize Express.js router object
const router = require("express").Router();

// Import references to the route models
const { User } = require("../../models");

/** **************************************
 ** The `/api/user` endpoint
 *  **************************************/

// POST to create a user
router.post("/", async (req, res) => {
    try {
        // Create a new user from the req.body post. The new userData is available
        // when a new user is successfully created from the user model.
        const userData = await User.create(req.body);

        // Dynamically, create session variables for use by all routes with the save method from userData
        req.session.save(() => {
            // Now have access to the new user ID that was just created and passed around to all routes
            req.session.user_id = userData.id;
            // Track if the user is logged
            req.session.logged_in = true;

            // Send back the user data
            res.status(200).json(userData);
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

// POST to login a user
router.post("/login", async (req, res) => {
    try {
        // Find a user based upon the req.bod.email that was posted
        const userData = await User.findOne({ where: { email: req.body.email } });

        // Is the email good? If not, let the user know with a generic email or password message
        if (!userData) {
            res.status(400).json({ message: "Incorrect email or password, please try again" });
            return;
        }

        // Check the password with the one that is stored.
        const validPassword = await userData.checkPassword(req.body.password);

        // Is the password good? If not, let the user know with a generic email or password message
        if (!validPassword) {
            res.status(400).json({ message: "Incorrect email or password, please try again" });
            return;
        }

        // If credentials are valid, create a new session and set two session variables
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            // Send back that the userData with a message
            res.json({ user: userData, message: "You are now logged in!" });
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

// POST to logout a user
router.post("/logout", (req, res) => {
    // If logged in, then destory the session
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;
