var Sequelize = require('sequelize');
var sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PWD, {
    host: process.env.DB_HOST,
    port:process.env.DB_PORT,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

var FaceValue = sequelize.define('faceValue', {
    age: Sequelize.INTEGER,
    pingyu: Sequelize.STRING,
    sex: Sequelize.STRING,
    faceValue: Sequelize.INTEGER,
    moreThan: Sequelize.INTEGER,
    imgUrl:Sequelize.STRING,
    uuid:Sequelize.STRING
})

FaceValue.sync();

module.exports = FaceValue