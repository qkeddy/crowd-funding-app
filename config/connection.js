// Require supporting NPM modules
const Sequelize = require("sequelize");
require("dotenv").config();

let sequelize;

// If the environment points to JAWSDB_URL, then use else, use the credentials in the .env file
if (process.env.JAWSDB_URL) {
    sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
    sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
        host: "localhost",
        dialect: "mysql",
        port: 3306,
    });
}

module.exports = sequelize;
