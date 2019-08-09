module.exports = function (QueryInterface, Sequelize) {
    const todoCategory = QueryInterface.define("todoCategory", {
        todoCategoryId: {
            type: Sequelize.INTEGER(100),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        ownerId: {
            type: Sequelize.INTEGER(10),
            allowNull: false,
            defaultValue: 1
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
            defaultValue: Sequelize.NOW
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
    });
    todoCategory.associate = function (models) {
        todoCategory.hasOne(models.todo, {
            foreignKey: "todoCategoryId"
        });
    };
    return todoCategory;
};
