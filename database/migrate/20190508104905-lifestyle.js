"use strict";

module.exports = {
    up: (QueryInterface, Sequelize) =>
        QueryInterface.createTable("lifestyle", {
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

    down: QueryInterface => QueryInterface.dropTable("lifestyle")
};
