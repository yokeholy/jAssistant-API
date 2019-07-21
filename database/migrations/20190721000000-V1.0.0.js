"use strict";

module.exports = {
    up: (QueryInterface, Sequelize) =>
        QueryInterface.sequelize.transaction(t =>
            // Clear everything in SequelizeMeta
            QueryInterface.sequelize.query("SELECT COUNT(*) AS migrationCount FROM `SequelizeMeta`;", {
                type: Sequelize.QueryTypes.SELECT,
                transaction: t,
                raw: true
            })
                .then(sequelizeMigrationData => {
                    if (sequelizeMigrationData[0].migrationCount) {
                        // If this jAssistant instance is upgrading from an eralier version, just reset the SequelizeMeta database without making any changes.
                        return QueryInterface.sequelize.query("TRUNCATE `SequelizeMeta`;", {transaction: t});
                    } else {
                        // If this is a new jAssistant instance, populate all necessary databases and initialize data.
                        return Promise.all([
                            // Insert tables that jAssistant required
                            QueryInterface.createTable("todo",
                                {
                                    todoId: {
                                        type: Sequelize.INTEGER(10),
                                        allowNull: false,
                                        primaryKey: true,
                                        autoIncrement: true
                                    },
                                    todoCategoryId: {
                                        type: Sequelize.INTEGER(100),
                                        allowNull: false,
                                        defaultValue: 1
                                    },
                                    todoName: {
                                        type: Sequelize.STRING(100),
                                        allowNull: false
                                    },
                                    todoDone: {
                                        type: Sequelize.BOOLEAN,
                                        allowNull: false,
                                        defaultValue: false
                                    },
                                    todoDeleted: {
                                        type: Sequelize.BOOLEAN,
                                        allowNull: false,
                                        defaultValue: false
                                    },
                                    todoCreatedDate: {
                                        type: Sequelize.DATE,
                                        allowNull: false,
                                        defaultValue: Sequelize.fn("NOW")
                                    },
                                    todoUpdatedDate: {
                                        type: Sequelize.DATE,
                                        allowNull: true
                                    },
                                    parentTodoId: {
                                        type: Sequelize.INTEGER(10),
                                        allowNull: true
                                    }
                                }, {
                                    tableName: "todo",
                                    timestamps: false,
                                    charset: "utf8",
                                    collate: "utf8_unicode_ci"
                                }, {transaction: t}
                            ),
                            QueryInterface.createTable("todoCategory",
                                {
                                    todoCategoryId: {
                                        type: Sequelize.INTEGER(100),
                                        allowNull: false,
                                        primaryKey: true,
                                        autoIncrement: true
                                    },
                                    todoCategoryName: {
                                        type: Sequelize.TEXT,
                                        allowNull: false
                                    },
                                    todoCategoryStatus: {
                                        type: Sequelize.BOOLEAN,
                                        allowNull: false,
                                        defaultValue: true
                                    },
                                    todoCategoryCreatedDate: {
                                        type: Sequelize.DATE,
                                        allowNull: false,
                                        defaultValue: Sequelize.fn("NOW")
                                    },
                                    todoCategoryUpdatedDate: {
                                        type: Sequelize.DATE,
                                        allowNull: true
                                    }
                                }, {
                                    tableName: "todoCategory",
                                    timestamps: false,
                                    charset: "utf8",
                                    collate: "utf8_unicode_ci"
                                }, {transaction: t}
                            ),
                            QueryInterface.createTable("note",
                                {
                                    noteId: {
                                        type: Sequelize.INTEGER(10),
                                        allowNull: false,
                                        primaryKey: true,
                                        autoIncrement: true
                                    },
                                    noteTitle: {
                                        type: Sequelize.TEXT,
                                        allowNull: false,
                                        defaultValue: "",
                                    },
                                    noteContent: {
                                        type: Sequelize.TEXT,
                                        allowNull: false
                                    },
                                    noteArchived: {
                                        type: Sequelize.BOOLEAN,
                                        allowNull: false,
                                        defaultValue: false
                                    },
                                    noteCreatedDate: {
                                        type: Sequelize.DATE,
                                        allowNull: false,
                                        defaultValue: Sequelize.fn("NOW")
                                    },
                                    noteUpdatedDate: {
                                        type: Sequelize.DATE,
                                        allowNull: true
                                    }
                                }, {
                                    tableName: "note",
                                    timestamps: false,
                                    charset: "utf8",
                                    collate: "utf8_unicode_ci"
                                }, {transaction: t}
                            ),
                            QueryInterface.createTable("routine",
                                {
                                    routineId: {
                                        type: Sequelize.INTEGER(10),
                                        allowNull: false,
                                        primaryKey: true,
                                        autoIncrement: true
                                    },
                                    routineName: {
                                        type: Sequelize.STRING(100),
                                        allowNull: false
                                    },
                                    routineActive: {
                                        type: Sequelize.BOOLEAN,
                                        allowNull: false,
                                        defaultValue: true
                                    },
                                    routineFrequencyType: {
                                        type: Sequelize.INTEGER(1),
                                        allowNull: false,
                                        defaultValue: 1,
                                        comment: "1: daily, 2: weekly, 3: monthly"
                                    },
                                    routineFrequencyValue: {
                                        type: Sequelize.INTEGER(3),
                                        allowNull: false,
                                        defaultValue: 127,
                                        comment: "For daily: it's stored as base 10 integer which represents a binary value of a 7-bit length string. i.e. 127 means '1111111' which means every day of the week."
                                    },
                                    routineConsecutive: {
                                        type: Sequelize.INTEGER(6),
                                        allowNull: false,
                                        defaultValue: 0
                                    },
                                    routineCreatedDate: {
                                        type: Sequelize.DATE,
                                        allowNull: false,
                                        defaultValue: Sequelize.fn("NOW")
                                    },
                                    routineUpdatedDate: {
                                        type: Sequelize.DATE,
                                        allowNull: true
                                    },
                                    routineLastCheckInDate: {
                                        type: Sequelize.DATE,
                                        allowNull: true
                                    }
                                }, {
                                    tableName: "routine",
                                    timestamps: false,
                                    charset: "utf8",
                                    collate: "utf8_unicode_ci"
                                }, {transaction: t}
                            ),
                            QueryInterface.createTable("routineHistory",
                                {
                                    routineHistoryId: {
                                        type: Sequelize.INTEGER(10),
                                        allowNull: false,
                                        primaryKey: true,
                                        autoIncrement: true
                                    },
                                    routineId: {
                                        type: Sequelize.INTEGER(10),
                                        allowNull: false
                                    },
                                    historyDate: {
                                        type: Sequelize.DATE,
                                        allowNull: false,
                                        defaultValue: Sequelize.fn("NOW")
                                    }
                                }, {
                                    tableName: "routineHistory",
                                    timestamps: false,
                                    charset: "utf8",
                                    collate: "utf8_unicode_ci"
                                }, {transaction: t}
                            ),
                            QueryInterface.createTable("lifestyle",
                                {
                                    lifestyleId: {
                                        type: Sequelize.INTEGER(10),
                                        allowNull: false,
                                        primaryKey: true,
                                        autoIncrement: true
                                    },
                                    lifestyleStatus: {
                                        type: Sequelize.BOOLEAN,
                                        allowNull: false,
                                        defaultValue: true
                                    },
                                    lifestyleName: {
                                        type: Sequelize.TEXT,
                                        allowNull: false
                                    },
                                    lifestyleCaption: {
                                        type: Sequelize.TEXT,
                                        allowNull: false,
                                        defaultValue: ""
                                    },
                                    lifestyleIconName: {
                                        type: Sequelize.TEXT,
                                        allowNull: false,
                                        defaultValue: "success"
                                    },
                                    lifestyleColorName: {
                                        type: Sequelize.TEXT,
                                        allowNull: false,
                                        defaultValue: "tint"
                                    },
                                    lifestyleDailyValue: {
                                        type: Sequelize.INTEGER(2),
                                        allowNull: false,
                                        defaultValue: 1
                                    },
                                    lifestyleCreatedDate: {
                                        type: Sequelize.DATE,
                                        allowNull: false,
                                        defaultValue: Sequelize.fn("NOW")
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
                                }, {transaction: t}
                            ),
                            QueryInterface.createTable("lifestyleHistory",
                                {
                                    lifestyleHistoryDate: {
                                        type: Sequelize.DATE,
                                        allowNull: false,
                                        primaryKey: true,
                                        defaultValue: Sequelize.fn("NOW")
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
                                }, {transaction: t}
                            ),
                            QueryInterface.createTable("user",
                                {
                                    userId: {
                                        type: Sequelize.INTEGER(10),
                                        allowNull: false,
                                        primaryKey: true,
                                        autoIncrement: true
                                    },
                                    userEmail: {
                                        type: Sequelize.STRING(100),
                                        allowNull: false
                                    },
                                    userPassword: {
                                        type: Sequelize.STRING(100),
                                        allowNull: false
                                    },
                                    userName: {
                                        type: Sequelize.STRING(100),
                                        allowNull: false
                                    }
                                }, {
                                    tableName: "user",
                                    timestamps: false,
                                    charset: "utf8",
                                    collate: "utf8_unicode_ci"
                                }, {transaction: t}
                            ),
                            QueryInterface.createTable("loginSession",
                                {
                                    loginSessionId: {
                                        type: Sequelize.INTEGER(10),
                                        allowNull: false,
                                        primaryKey: true,
                                        autoIncrement: true
                                    },
                                    userId: {
                                        type: Sequelize.INTEGER(10),
                                        allowNull: false
                                    },
                                    authKey: {
                                        type: Sequelize.STRING(100),
                                        allowNull: false
                                    },
                                    sessionTime: {
                                        type: Sequelize.DATE,
                                        allowNull: false
                                    }
                                }, {
                                    tableName: "loginSession",
                                    timestamps: false,
                                    charset: "utf8",
                                    collate: "utf8_unicode_ci"
                                }, {transaction: t}
                            ),
                            QueryInterface.createTable("comment",
                                {
                                    commentId: {
                                        type: Sequelize.INTEGER(100),
                                        allowNull: false,
                                        primaryKey: true,
                                        autoIncrement: true
                                    },
                                    commentContent: {
                                        type: Sequelize.TEXT,
                                        allowNull: false
                                    },
                                    commentType: {
                                        type: Sequelize.INTEGER(1),
                                        allowNull: false
                                    },
                                    commentEntityId: {
                                        type: Sequelize.INTEGER(100),
                                        allowNull: false
                                    },
                                    commentCreatedDate: {
                                        type: Sequelize.DATE,
                                        allowNull: false,
                                        defaultValue: Sequelize.fn("NOW")
                                    },
                                    commentDeleted: {
                                        type: Sequelize.BOOLEAN,
                                        allowNull: false,
                                        defaultValue: false
                                    },
                                }, {
                                    tableName: "comment",
                                    timestamps: false,
                                    charset: "utf8",
                                    collate: "utf8_unicode_ci"
                                }, {transaction: t}
                            ),
                            QueryInterface.createTable("settings",
                                {
                                    settingsName: {
                                        type: Sequelize.STRING(100),
                                        allowNull: false,
                                        primaryKey: true
                                    },
                                    settingsValue: {
                                        type: Sequelize.TEXT,
                                        allowNull: false
                                    }
                                }, {
                                    tableName: "settings",
                                    timestamps: false,
                                    charset: "utf8",
                                    collate: "utf8_unicode_ci"
                                }, {transaction: t}
                            )
                        ])
                            .then(() =>
                                Promise.all([
                                    QueryInterface.bulkInsert("user", [
                                        {
                                            userEmail: "demo@example.com",
                                            // Password: "jAssistant2019"
                                            userPassword: "$2a$10$FXC8OD94q02bDu5htvVku.q9xfluE95lZCEAxDOFGQOmarQMKC0fm",
                                            userName: "jAssistant Demo"
                                        }
                                    ]),
                                    QueryInterface.bulkInsert("todoCategory", [
                                        {
                                            todoCategoryName: "Default"
                                        }
                                    ]),
                                    QueryInterface.bulkInsert("settings", [
                                        {
                                            settingsName: "appName",
                                            settingsValue: "jAssistant"
                                        }, {
                                            settingsName: "todoAlertLevel",
                                            settingsValue: "7"
                                        }, {
                                            settingsName: "todoDangerLevel",
                                            settingsValue: "14"
                                        }
                                    ]),
                                ])
                            );
                    }
                })
                .catch(error => {
                    /* eslint-disable-next-line no-console */
                    console.log(error);
                })
        ),

    down: QueryInterface =>
        QueryInterface.sequelize.transaction(t =>
            Promise.all([
                QueryInterface.dropTable("todo", {transaction: t}),
                QueryInterface.dropTable("todoCategory", {transaction: t}),
                QueryInterface.dropTable("note", {transaction: t}),
                QueryInterface.dropTable("routine", {transaction: t}),
                QueryInterface.dropTable("routineHistory", {transaction: t}),
                QueryInterface.dropTable("lifestyle", {transaction: t}),
                QueryInterface.dropTable("lifestyleHistory", {transaction: t}),
                QueryInterface.dropTable("user", {transaction: t}),
                QueryInterface.dropTable("loginSession", {transaction: t}),
                QueryInterface.dropTable("comment", {transaction: t}),
                QueryInterface.dropTable("settings", {transaction: t})
            ])
        ),
};
