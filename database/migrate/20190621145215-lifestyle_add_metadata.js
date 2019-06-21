"use strict";

module.exports = {
    up: (queryInterface, DataTypes) =>
        queryInterface.addColumn(
            "lifestyle",
            "lifestyleStatus",
            {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
                after: "lifestyleId"
            }
        )
            .then(() =>
                queryInterface.addColumn(
                    "lifestyle",
                    "lifestyleCaption",
                    {
                        type: DataTypes.TEXT,
                        allowNull: false,
                        defaultValue: "",
                        after: "lifestyleName"
                    }
                )
            )
            .then(() =>
                queryInterface.addColumn(
                    "lifestyle",
                    "lifestyleIconName",
                    {
                        type: DataTypes.TEXT,
                        allowNull: false,
                        defaultValue: "success",
                        after: "lifestyleCaption"
                    }
                )
            )
            .then(() =>
                queryInterface.addColumn(
                    "lifestyle",
                    "lifestyleColorName",
                    {
                        type: DataTypes.TEXT,
                        allowNull: false,
                        defaultValue: "tint",
                        after: "lifestyleIconName"
                    }
                )
            ),

    down: queryInterface =>
        queryInterface.removeColumn(
            "lifestyle",
            "lifestyleStatus"
        )
            .then(() =>
                queryInterface.removeColumn(
                    "lifestyle",
                    "lifestyleCaption"
                )
            )
            .then(() =>
                queryInterface.removeColumn(
                    "lifestyle",
                    "lifestyleIconName"
                )
            )
            .then(() =>
                queryInterface.removeColumn(
                    "lifestyle",
                    "lifestyleColorName"
                )
            )
};
