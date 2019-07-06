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
            defaultValue: true
        }
    }, {
        tableName: "todoCategory",
        timestamps: false
    });
    todoCategory.associate = function (models) {
        todoCategory.hasOne(models.todo, {
            foreignKey: "todoCategoryId"
        });
    };
    return todoCategory;
};
