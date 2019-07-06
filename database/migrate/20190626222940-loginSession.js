"use strict";

module.exports = {
    up: (QueryInterface, Sequelize) =>
        QueryInterface.createTable("loginSession", {
            loginSessionId: {
                type: Sequelize.INTEGER(10),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            userId: {
                type: Sequelize.INTEGER(10),
                allowNull: false
            },
            authKey: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            sessionTime: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            }
        }, {
            tableName: "loginSession",
            timestamps: false,
            charset: "utf8",
            collate: "utf8_unicode_ci"
        }),

    down: QueryInterface => QueryInterface.dropTable("loginSession")
};
