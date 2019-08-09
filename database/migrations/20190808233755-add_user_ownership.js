module.exports = {
    up: (QueryInterface, Sequelize) =>
        Promise.all([
            QueryInterface.addColumn("comment", "ownerId", {
                type: Sequelize.INTEGER(10),
                allowNull: false,
                defaultValue: 1,
                after: "commentId"
            }),
            QueryInterface.addColumn("lifestyle", "ownerId", {
                type: Sequelize.INTEGER(10),
                allowNull: false,
                defaultValue: 1,
                after: "lifestyleId"
            }),
            QueryInterface.addColumn("note", "ownerId", {
                type: Sequelize.INTEGER(10),
                allowNull: false,
                defaultValue: 1,
                after: "noteId"
            }),
            QueryInterface.addColumn("routine", "ownerId", {
                type: Sequelize.INTEGER(10),
                allowNull: false,
                defaultValue: 1,
                after: "routineId"
            }),
            QueryInterface.addColumn("settings", "ownerId", {
                type: Sequelize.INTEGER(10),
                allowNull: false,
                defaultValue: 1,
                after: "settingsValue"
            }),
            QueryInterface.addColumn("todo", "ownerId", {
                type: Sequelize.INTEGER(10),
                allowNull: false,
                defaultValue: 1,
                after: "todoId"
            }),
            QueryInterface.addColumn("todoCategory", "ownerId", {
                type: Sequelize.INTEGER(10),
                allowNull: false,
                defaultValue: 1,
                after: "todoCategoryId"
            }),
        ])
            .catch(error => {
                /* eslint-disable-next-line no-console */
                console.log(error);
            }),

    down: QueryInterface =>
        Promise.all([
            QueryInterface.removeColumn("comment", "ownerId"),
            QueryInterface.removeColumn("lifestyle", "ownerId"),
            QueryInterface.removeColumn("note", "ownerId"),
            QueryInterface.removeColumn("routine", "ownerId"),
            QueryInterface.removeColumn("settings", "ownerId"),
            QueryInterface.removeColumn("todo", "ownerId"),
            QueryInterface.removeColumn("todoCategory", "ownerId"),
        ])
};
