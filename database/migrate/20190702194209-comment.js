"use strict";

module.exports = {
    up: (QueryInterface, Sequelize) =>
        QueryInterface.createTable("comment", {
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
                defaultValue: Sequelize.NOW
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
        }),

    down: QueryInterface => QueryInterface.dropTable("comment")
};
