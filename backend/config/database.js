const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('hotel_reservation', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
    logging: false, // Set to console.log to see SQL queries
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// Test the connection
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = {
    sequelize,
    testConnection
}; 