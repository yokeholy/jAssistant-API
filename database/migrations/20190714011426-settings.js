"use strict";

module.exports = {
    up: (QueryInterface, Sequelize) =>
        QueryInterface.createTable("settings", {
            settingsName: {
                type: Sequelize.STRING(100),
                allowNull: false,
                primaryKey: true
            },
            settingsValue: {
                type: Sequelize.TEXT,
                allowNull: false
            }
        }, {
            tableName: "settings",
            timestamps: false,
            charset: "utf8",
            collate: "utf8_unicode_ci"
        }),

    down: QueryInterface => QueryInterface.dropTable("settings")
};
