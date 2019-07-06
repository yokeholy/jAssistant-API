"use strict";

module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable("user", {
            userId: {
                type: Sequelize.INTEGER(10),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            userEmail: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            userPassword: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            userName: {
                type: Sequelize.STRING(100),
                allowNull: false
            }
        }, {
            tableName: "user",
            timestamps: false,
            charset: "utf8",
            collate: "utf8_unicode_ci"
        }),

    down: queryInterface => queryInterface.dropTable("user")
};
