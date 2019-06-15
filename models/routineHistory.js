module.exports = function (sequelize, DataTypes) {
    const routineHistory = sequelize.define("routineHistory", {
        routineHistoryId: {
            type: DataTypes.INTEGER(10),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        routineId: {
            type: DataTypes.INTEGER(10),
            allowNull: false
        },
        historyDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
        }
    }, {
        tableName: "routineHistory",
        timestamps: false
    });
    return routineHistory;
};
