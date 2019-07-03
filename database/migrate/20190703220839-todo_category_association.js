"use strict";

module.exports = {
    up: (queryInterface, DataTypes) =>
        queryInterface.addColumn(
            "todo",
            "todoCategoryId",
            {
                type: DataTypes.INTEGER(100),
                allowNull: false,
                defaultValue: 1,
                after: "todoId"
            }
        ),

    down: queryInterface => queryInterface.removeColumn(
        "todo",
        "todoCategoryId"
    )
};
