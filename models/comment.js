module.exports = function (sequelize, DataTypes) {
    const comment = sequelize.define("comment", {
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
        commentCreatedDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
        },
        commentDeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
    }, {
        tableName: "comment",
        timestamps: false
    });
    return comment;
};
