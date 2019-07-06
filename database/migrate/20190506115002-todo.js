"use strict";

module.exports = {
    up: (QueryInterface, Sequelize) =>
        QueryInterface.createTable("todo", {
            todoId: {
                type: Sequelize.INTEGER(10),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            todoName: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            todoStatus: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            todoCreatedDate: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            },
            todoUpdatedDate: {
                type: Sequelize.DATE,
                allowNull: true
            }
        }, {
            tableName: "todo",
            timestamps: false,
            charset: "utf8",
            collate: "utf8_unicode_ci"
        }),

    down: QueryInterface => QueryInterface.dropTable("todo")
};
