"use strict";

module.exports = {
    up: (QueryInterface, Sequelize) =>
        QueryInterface.addColumn(
            "note",
            "noteTitle",
            {
                type: Sequelize.TEXT,
                allowNull: false,
                defaultValue: "",
                after: "noteId"
            }
        ),

    down: QueryInterface =>
        QueryInterface.removeColumn(
            "note",
            "noteTitle"
        )
};
