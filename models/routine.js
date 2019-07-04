module.exports = function (sequelize, DataTypes) {
    const routine = sequelize.define("routine", {
        routineId: {
            type: DataTypes.INTEGER(10),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        routineName: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        routineActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        routineConsecutive: {
            type: DataTypes.INTEGER(6),
            allowNull: false,
            defaultValue: 0
        },
        routineCreatedDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
        },
        routineUpdatedDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        routineLastCheckInDate: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: "routine",
        timestamps: false
    });
    routine.associate = function (models) {
        routine.hasOne(models.comment, {
            foreignKey: "commentEntityId"
        });
    };
    return routine;
};
