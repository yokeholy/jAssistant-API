"use strict";

module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable("note", {
            noteId: {
                type: Sequelize.INTEGER(10),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            noteContent: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            noteArchived: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            noteCreatedDate: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
            },
            noteUpdatedDate: {
                type: Sequelize.DATE,
                allowNull: true
            }
        }, {
            tableName: "note",
            timestamps: false,
            charset: "utf8",
            collate: "utf8_unicode_ci"
        }),

    down: queryInterface => queryInterface.dropTable("note")
};
