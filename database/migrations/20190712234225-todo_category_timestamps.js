"use strict";

module.exports = {
    up: (QueryInterface, Sequelize) =>
        QueryInterface.addColumn(
            "todoCategory",
            "todoCategoryCreatedDate",
            {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.NOW
            }
        )
            .then(() =>
                QueryInterface.bulkUpdate(
                    "todoCategory",
                    { todoCategoryCreatedDate: new Date() }
                )
            )
            .then(() =>
                QueryInterface.changeColumn(
                    "todoCategory",
                    "todoCategoryCreatedDate",
                    {
                        type: Sequelize.DATE,
                        allowNull: false,
                        defaultValue: Sequelize.NOW
                    }
                )
            )
            .then(() =>
                QueryInterface.addColumn(
                    "todoCategory",
                    "todoCategoryUpdatedDate",
                    {
                        type: Sequelize.DATE,
                        allowNull: true
                    }
                )
            ),

    down: QueryInterface => QueryInterface.removeColumn(
        "todoCategory",
        "todoCategoryCreatedDate"
    )
        .then(() =>
            QueryInterface.removeColumn(
                "todoCategory",
                "todoCategoryUpdatedDate"
            )
        )
};
