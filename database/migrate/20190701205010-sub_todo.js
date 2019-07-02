"use strict";

module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.addColumn(
            "todo",
            "parentTodoId",
            {
                type: Sequelize.INTEGER(10),
                allowNull: true
            }
        ),

    down: queryInterface =>
        queryInterface.removeColumn(
            "todo",
            "parentTodoId"
        )
};
