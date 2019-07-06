module.exports = function (sequelize, DataTypes) {
    const todo = sequelize.define("todo", {
        todoId: {
            type: DataTypes.INTEGER(10),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        todoCategoryId: {
            type: DataTypes.INTEGER(100),
            allowNull: false,
            defaultValue: 1
        },
        todoName: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        todoStatus: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        todoCreatedDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
        },
        todoUpdatedDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        parentTodoId: {
            type: DataTypes.INTEGER(10),
            allowNull: true
        }
    }, {
        tableName: "todo",
        timestamps: false
    });
    todo.associate = function (models) {
        todo.hasOne(models.comment, {
            foreignKey: "commentEntityId"
        });
    };
    return todo;
};
