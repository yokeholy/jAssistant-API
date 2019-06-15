"use strict";

module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable("configuration", {
            configurationItem: {
                type: Sequelize.STRING(100),
                allowNull: false,
                primaryKey: true
            },
            configurationValue: {
                type: Sequelize.STRING(100),
                allowNull: false
            }
        }, {
            tableName: "configuration",
            timestamps: false,
            charset: "utf8",
            collate: "utf8_unicode_ci"
        }),

    down: queryInterface => queryInterface.dropTable("configuration")
};
