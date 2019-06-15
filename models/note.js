module.exports = function (sequelize, DataTypes) {
    const note = sequelize.define("note", {
        noteId: {
            type: DataTypes.INTEGER(10),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        noteContent: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        noteArchived: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        noteCreatedDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
        },
        noteUpdatedDate: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: "note",
        timestamps: false
    });
    return note;
};
