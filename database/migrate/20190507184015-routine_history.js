"use strict";

module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable("routineHistory", {
            routineHistoryId: {
                type: Sequelize.INTEGER(10),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            routineId: {
                type: Sequelize.INTEGER(10),
                allowNull: false
            },
            historyDate: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
            }
        }, {
            tableName: "routineHistory",
            timestamps: false,
            charset: "utf8",
            collate: "utf8_unicode_ci"
        }),

    down: queryInterface => queryInterface.dropTable("routineHistory")
};
