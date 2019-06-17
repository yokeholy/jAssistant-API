module.exports = function (sequelize, DataTypes) {
    const lifestyleHistory = sequelize.define("lifestyleHistory", {
        lifestyleHistoryDate: {
            type: DataTypes.DATE,
            allowNull: false,
            primaryKey: true,
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
        },
        lifestyleId: {
            type: DataTypes.INTEGER(10),
            allowNull: false
        }
    }, {
        tableName: "lifestyleHistory",
        timestamps: false
    });
    return lifestyleHistory;
};
