"use strict";

module.exports = {
    up: (QueryInterface, Sequelize) =>
        // TODO: Add default category Id 1
        QueryInterface.createTable("todoCategory", {
            todoCategoryId: {
                type: Sequelize.INTEGER(100),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            todoCategoryName: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            todoCategoryStatus: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            }
        }, {
            tableName: "todoCategory",
            timestamps: false,
            charset: "utf8",
            collate: "utf8_unicode_ci"
        }),

    down: QueryInterface => QueryInterface.dropTable("todoCategory")
};
