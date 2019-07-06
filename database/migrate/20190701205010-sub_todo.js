"use strict";

module.exports = {
    up: (QueryInterface, Sequelize) =>
        QueryInterface.addColumn(
            "todo",
            "parentTodoId",
            {
                type: Sequelize.INTEGER(10),
                allowNull: true
            }
        ),

    down: QueryInterface =>
        QueryInterface.removeColumn(
            "todo",
            "parentTodoId"
        )
};
