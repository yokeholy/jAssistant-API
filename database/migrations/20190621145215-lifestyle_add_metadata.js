"use strict";

module.exports = {
    up: (QueryInterface, Sequelize) =>
        QueryInterface.addColumn(
            "lifestyle",
            "lifestyleStatus",
            {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
                after: "lifestyleId"
            }
        )
            .then(() =>
                QueryInterface.addColumn(
                    "lifestyle",
                    "lifestyleCaption",
                    {
                        type: Sequelize.TEXT,
                        allowNull: false,
                        defaultValue: "",
                        after: "lifestyleName"
                    }
                )
            )
            .then(() =>
                QueryInterface.addColumn(
                    "lifestyle",
                    "lifestyleIconName",
                    {
                        type: Sequelize.TEXT,
                        allowNull: false,
                        defaultValue: "success",
                        after: "lifestyleCaption"
                    }
                )
            )
            .then(() =>
                QueryInterface.addColumn(
                    "lifestyle",
                    "lifestyleColorName",
                    {
                        type: Sequelize.TEXT,
                        allowNull: false,
                        defaultValue: "tint",
                        after: "lifestyleIconName"
                    }
                )
            ),

    down: QueryInterface =>
        QueryInterface.removeColumn(
            "lifestyle",
            "lifestyleStatus"
        )
            .then(() =>
                QueryInterface.removeColumn(
                    "lifestyle",
                    "lifestyleCaption"
                )
            )
            .then(() =>
                QueryInterface.removeColumn(
                    "lifestyle",
                    "lifestyleIconName"
                )
            )
            .then(() =>
                QueryInterface.removeColumn(
                    "lifestyle",
                    "lifestyleColorName"
                )
            )
};
