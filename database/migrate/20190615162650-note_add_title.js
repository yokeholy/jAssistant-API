"use strict";

module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.addColumn(
            "note",
            "noteTitle",
            {
                type: Sequelize.TEXT,
                allowNull: false,
                defaultValue: "",
                after: "noteId"
            }
        ),

    down: queryInterface =>
        queryInterface.removeColumn(
            "note",
            "noteTitle"
        )
};
