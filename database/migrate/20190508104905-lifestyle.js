"use strict";

module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable("lifestyle", {
            lifestyleDate: {
                type: Sequelize.DATEONLY,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.NOW
            },
            water: {
                type: Sequelize.INTEGER(2),
                allowNull: false,
                defaultValue: 0
            },
            standing: {
                type: Sequelize.INTEGER(2),
                allowNull: false,
                defaultValue: 0
            },
            workout: {
                type: Sequelize.INTEGER(2),
                allowNull: false,
                defaultValue: 0
            }
        }, {
            tableName: "lifestyle",
            timestamps: false,
            charset: "utf8",
            collate: "utf8_unicode_ci"
        }),

    down: queryInterface => queryInterface.dropTable("lifestyle")
};
