"use strict";

module.exports = {
    up: (QueryInterface, Sequelize) =>
        QueryInterface.createTable("lifestyleHistory", {
            lifestyleHistoryDate: {
                type: Sequelize.DATE,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.NOW
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

    down: QueryInterface => QueryInterface.dropTable("lifestyleHistory")
};
