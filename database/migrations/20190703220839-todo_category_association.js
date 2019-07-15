"use strict";

module.exports = {
    up: (QueryInterface, Sequelize) =>
        QueryInterface.addColumn(
            "todo",
            "todoCategoryId",
            {
                type: Sequelize.INTEGER(100),
                allowNull: false,
                defaultValue: 1,
                after: "todoId"
            }
        ),

    down: QueryInterface => QueryInterface.removeColumn(
        "todo",
        "todoCategoryId"
    )
};
