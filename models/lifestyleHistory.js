module.exports = function (sequelize, DataTypes) {
    const lifestyleHistory = sequelize.define("lifestyleHistory", {
        lifestyleHistoryDate: {
            type: DataTypes.DATE,
            allowNull: false,
            primaryKey: true,
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
        },
        lifestyleType: {
            type: DataTypes.STRING(20),
            allowNull: false
        }
    }, {
        tableName: "lifestyleHistory",
        timestamps: false
    });
    return lifestyleHistory;
};
