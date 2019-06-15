"use strict";

module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable("lifestyleHistory", {
            lifestyleHistoryDate: {
                type: Sequelize.DATE,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
            },
            lifestyleType: {
                type: Sequelize.STRING(20),
                allowNull: false
            }
        }, {
            tableName: "lifestyleHistory",
            timestamps: false,
            charset: "utf8",
            collate: "utf8_unicode_ci"
        }),

    down: queryInterface => queryInterface.dropTable("lifestyleHistory")
};
