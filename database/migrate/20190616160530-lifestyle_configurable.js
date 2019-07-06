"use strict";

module.exports = {
    up: (QueryInterface, Sequelize) =>
        QueryInterface.dropTable("lifestyle")
            .then(() =>
                QueryInterface.createTable("lifestyle", {
                    lifestyleId: {
                        type: Sequelize.INTEGER(10),
                        allowNull: false,
                        primaryKey: true,
                        autoIncrement: true
                    },
                    lifestyleName: {
                        type: Sequelize.TEXT,
                        allowNull: false
                    },
                    lifestyleDailyValue: {
                        type: Sequelize.INTEGER(2),
                        allowNull: false,
                        defaultValue: 1
                    },
                    lifestyleCreatedDate: {
                        type: Sequelize.DATE,
                        allowNull: false,
                        defaultValue: Sequelize.NOW
                    },
                    lifestyleUpdatedDate: {
                        type: Sequelize.DATE,
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
                QueryInterface.dropTable("lifestyleHistory")
            )
            .then(() =>
                QueryInterface.createTable("lifestyleHistory", {
                    lifestyleHistoryDate: {
                        type: Sequelize.DATE,
                        allowNull: false,
                        primaryKey: true,
                        defaultValue: Sequelize.NOW
                    },
                    lifestyleId: {
                        type: Sequelize.INTEGER(10),
                        allowNull: false
                    }
                }, {
                    tableName: "lifestyleHistory",
                    timestamps: false,
                    charset: "utf8",
                    collate: "utf8_unicode_ci"
                })
            ),

    down: (QueryInterface, Sequelize) =>
        QueryInterface.dropTable("lifestyle")
            .then(() =>
                QueryInterface.createTable("lifestyle", {
                    lifestyleDate: {
                        type: Sequelize.DATEONLY,
                        allowNull: false,
                        primaryKey: true,
                        defaultValue: Sequelize.NOW
                    },
                    water: {
                        type: Sequelize.INTEGER(2),
                        allowNull: false,
                        defaultValue: 0
                    },
                    standing: {
                        type: Sequelize.INTEGER(2),
                        allowNull: false,
                        defaultValue: 0
                    },
                    workout: {
                        type: Sequelize.INTEGER(2),
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
                QueryInterface.dropTable("lifestyleHistory")
            )
            .then(() =>
                QueryInterface.createTable("lifestyleHistory", {
                    lifestyleHistoryDate: {
                        type: Sequelize.DATE,
                        allowNull: false,
                        primaryKey: true,
                        defaultValue: Sequelize.NOW
                    },
                    lifestyleType: {
                        type: Sequelize.STRING(20),
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
