"use strict";

module.exports = {
    up: (queryInterface, DataTypes) =>
        // TODO: Add default category Id 1
        queryInterface.createTable("todoCategory", {
            todoCategoryId: {
                type: DataTypes.INTEGER(100),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            todoCategoryName: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            todoCategoryStatus: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            }
        }, {
            tableName: "todoCategory",
            timestamps: true
        }),

    down: queryInterface => queryInterface.dropTable("todoCategory")
};
