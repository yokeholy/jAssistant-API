"use strict";

module.exports = {
    up: (QueryInterface, Sequelize) =>
        QueryInterface.createTable("configuration", {
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

    down: QueryInterface => QueryInterface.dropTable("configuration")
};
