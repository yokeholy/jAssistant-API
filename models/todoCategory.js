module.exports = function (sequelize, DataTypes) {
    const todoCategory = sequelize.define("todoCategory", {
        todoCategoryId: {
            type: DataTypes.INTEGER(100),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        todoCategoryName: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        todoCategoryStatus: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        tableName: "todoCategory",
        timestamps: true
    });
    todoCategory.associate = function (models) {
        todoCategory.hasOne(models.todo, {
            foreignKey: "todoCategoryId"
        });
    };
    return todoCategory;
};
