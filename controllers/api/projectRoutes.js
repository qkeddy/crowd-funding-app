// Initialize Express.js router object
const router = require("express").Router();

// Import references to the route models
const { Project } = require("../../models");

/** **************************************
 ** The `/api/project` endpoint
 *  **************************************/

// POST to create a project
router.post("/", async (req, res) => {
    try {
        // Create a new project from the req.body post.
        const newProject = await Project.create({
            ...req.body,
            // Associate the project with the user
            user_id: req.session.user_id,
        });
        // Send back new project after creation
        res.status(200).json(newProject);
    } catch (err) {
        res.status(400).json(err);
    }
});

// DELETE to remove a project
router.delete("/:id", async (req, res) => {
    try {
        // Delete a project based upon the where clause
        const projectData = await Project.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });

        // If there is no project, then let the user know
        if (!projectData) {
            res.status(404).json({ message: "No project found with this id!" });
            return;
        }

        // Return the projectData
        res.status(200).json(projectData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
