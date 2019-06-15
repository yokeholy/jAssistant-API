module.exports = function (sequelize, DataTypes) {
    const todo = sequelize.define("todo", {
        todoId: {
            type: DataTypes.INTEGER(10),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
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
        }
    }, {
        tableName: "todo",
        timestamps: false
    });
    return todo;
};
