module.exports = function (QueryInterface, Sequelize) {
    const todo = QueryInterface.define("todo", {
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
            defaultValue: Sequelize.NOW
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
    });
    todo.associate = function (models) {
        todo.hasOne(models.comment, {
            foreignKey: "commentEntityId"
        });
    };
    return todo;
};
