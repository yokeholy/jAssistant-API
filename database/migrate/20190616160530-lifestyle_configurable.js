"use strict";

module.exports = {
    up: (queryInterface, DataTypes) =>
        queryInterface.dropTable("lifestyle")
            .then(() =>
                queryInterface.createTable("lifestyle", {
                    lifestyleId: {
                        type: DataTypes.INTEGER(10),
                        allowNull: false,
                        primaryKey: true,
                        autoIncrement: true
                    },
                    lifestyleName: {
                        type: DataTypes.TEXT,
                        allowNull: false
                    },
                    lifestyleDailyValue: {
                        type: DataTypes.INTEGER(2),
                        allowNull: false,
                        defaultValue: 1
                    },
                    lifestyleCreatedDate: {
                        type: DataTypes.DATE,
                        allowNull: false,
                        defaultValue: DataTypes.literal("CURRENT_TIMESTAMP")
                    },
                    lifestyleUpdatedDate: {
                        type: DataTypes.DATE,
                        allowNull: true
                    }
                }, {
                    tableName: "lifestyle",
                    timestamps: false,
                    charset: "utf8",
                    collate: "utf8_unicode_ci"
                })
            )
            .then(() =>
                queryInterface.dropTable("lifestyleHistory")
            )
            .then(() =>
                queryInterface.createTable("lifestyleHistory", {
                    lifestyleHistoryDate: {
                        type: DataTypes.DATE,
                        allowNull: false,
                        primaryKey: true,
                        defaultValue: DataTypes.literal("CURRENT_TIMESTAMP")
                    },
                    lifestyleId: {
                        type: DataTypes.INTEGER(10),
                        allowNull: false
                    }
                }, {
                    tableName: "lifestyleHistory",
                    timestamps: false,
                    charset: "utf8",
                    collate: "utf8_unicode_ci"
                })
            ),

    down: (queryInterface, DataTypes) =>
        queryInterface.dropTable("lifestyle")
            .then(() =>
                queryInterface.createTable("lifestyle", {
                    lifestyleDate: {
                        type: DataTypes.DATEONLY,
                        allowNull: false,
                        primaryKey: true,
                        defaultValue: DataTypes.NOW
                    },
                    water: {
                        type: DataTypes.INTEGER(2),
                        allowNull: false,
                        defaultValue: 0
                    },
                    standing: {
                        type: DataTypes.INTEGER(2),
                        allowNull: false,
                        defaultValue: 0
                    },
                    workout: {
                        type: DataTypes.INTEGER(2),
                        allowNull: false,
                        defaultValue: 0
                    }
                }, {
                    tableName: "lifestyle",
                    timestamps: false,
                    charset: "utf8",
                    collate: "utf8_unicode_ci"
                })
            )
            .then(() =>
                queryInterface.dropTable("lifestyleHistory")
            )
            .then(() =>
                queryInterface.createTable("lifestyleHistory", {
                    lifestyleHistoryDate: {
                        type: DataTypes.DATE,
                        allowNull: false,
                        primaryKey: true,
                        defaultValue: DataTypes.literal("CURRENT_TIMESTAMP")
                    },
                    lifestyleType: {
                        type: DataTypes.STRING(20),
                        allowNull: false
                    }
                }, {
                    tableName: "lifestyleHistory",
                    timestamps: false,
                    charset: "utf8",
                    collate: "utf8_unicode_ci"
                })
            ),
};
