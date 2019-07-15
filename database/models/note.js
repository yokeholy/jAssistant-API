module.exports = function (QueryInterface, Sequelize) {
    const note = QueryInterface.define("note", {
        noteId: {
            type: Sequelize.INTEGER(10),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        noteTitle: {
            type: Sequelize.TEXT,
            allowNull: false,
            defaultValue: ""
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
            defaultValue: Sequelize.NOW
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
    });
    return note;
};
