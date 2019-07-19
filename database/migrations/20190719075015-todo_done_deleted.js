"use strict";

module.exports = {
    up: (QueryInterface, Sequelize) =>
        QueryInterface.renameColumn(
            "todo",
            "todoStatus",
            "todoDone"
        )
            .then(() =>
                QueryInterface.addColumn(
                    "todo",
                    "todoDeleted",
                    {
                        type: Sequelize.BOOLEAN,
                        allowNull: false,
                        defaultValue: false,
                        after: "todoDone"
                    }
                )
            ),

    down: QueryInterface => QueryInterface.removeColumn(
        "todo",
        "todoDeleted"
    )
        .then(() =>
            QueryInterface.renameColumn(
                "todo",
                "todoDone",
                "todoStatus"
            )
        )
};
