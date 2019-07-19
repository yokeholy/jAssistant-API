"use strict";

module.exports = {
    up: (QueryInterface, Sequelize) =>
        QueryInterface.createTable("todoCategory", {
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
            }
        }, {
            tableName: "todoCategory",
            timestamps: false,
            charset: "utf8",
            collate: "utf8_unicode_ci"
        })
            .then(() =>
                QueryInterface.bulkInsert("todoCategory", [{
                    todoCategoryName: "Default"
                }])
            ),

    down: QueryInterface => QueryInterface.dropTable("todoCategory")
};
