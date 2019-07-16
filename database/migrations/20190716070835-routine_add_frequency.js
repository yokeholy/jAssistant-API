"use strict";

module.exports = {
    up: (QueryInterface, Sequelize) =>
        QueryInterface.addColumn(
            "routine",
            "routineFrequencyType",
            {
                type: Sequelize.INTEGER(1),
                allowNull: false,
                defaultValue: 1,
                comment: "1: daily, 2: weekly, 3: monthly",
                after: "routineActive"
            }
        )
            .then(() =>
                QueryInterface.bulkUpdate(
                    "routine",
                    { routineFrequencyType: 1 }
                )
            )
            .then(() =>
                QueryInterface.addColumn(
                    "routine",
                    "routineFrequencyValue",
                    {
                        type: Sequelize.INTEGER(3),
                        allowNull: false,
                        defaultValue: 127,
                        comment: "For daily: it's stored as base 10 integer which represents a binary value of a 7-bit length string. i.e. 127 means '1111111' which means every day of the week.",
                        after: "routineFrequencyType"
                    }
                )
            )
            .then(() =>
                QueryInterface.bulkUpdate(
                    "routine",
                    { routineFrequencyValue: 127 }
                )
            ),

    down: QueryInterface => QueryInterface.removeColumn(
        "routine",
        "routineFrequencyType"
    )
        .then(() =>
            QueryInterface.removeColumn(
                "routine",
                "routineFrequencyValue"
            )
        )
};
