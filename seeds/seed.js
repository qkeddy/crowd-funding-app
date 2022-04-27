// Initialize a connection to the database connection
const sequelize = require('../config/connection');

// Destructured models from the models defined in index.js
const { User, Project } = require('../models');

// References to seed data
const userData = require('./userData.json');
const projectData = require('./projectData.json');

const seedDatabase = async () => {
    // Force a table drop and recreation (when true)
    await sequelize.sync({ force: true });

    // Bulk create users
    const users = await User.bulkCreate(userData, {
        individualHooks: true,
        returning: true
    });

    // Bulk create projects and spread projects on a random user id.
    for (const project of projectData) {
        await Project.create({
            ...project,
            user_id: users[Math.floor(Math.random() * users.length)].id
        });
    }

    process.exit(0);
};

// Execute the seedDatabase method
seedDatabase();
