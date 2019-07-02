"use strict";

module.exports = {
    up: (queryInterface, DataTypes) =>
        queryInterface.createTable("comment", {
            commentId: {
                type: DataTypes.INTEGER(100),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            commentContent: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            commentType: {
                type: DataTypes.INTEGER(1),
                allowNull: false
            },
            commentEntityId: {
                type: DataTypes.INTEGER(100),
                allowNull: false
            },
            commentDeleted: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
        }, {
            tableName: "comment",
            timestamps: true
        }),

    down: queryInterface => queryInterface.dropTable("comment")
};
