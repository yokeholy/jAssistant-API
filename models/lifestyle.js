module.exports = function (sequelize, DataTypes) {
    const lifestyle = sequelize.define("lifestyle", {
        lifestyleDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.NOW
        },
        water: {
            type: DataTypes.INTEGER(2),
            allowNull: false,
            defaultValue: 0
        },
        standing: {
            type: DataTypes.INTEGER(2),
            allowNull: false,
            defaultValue: 0
        },
        workout: {
            type: DataTypes.INTEGER(2),
            allowNull: false,
            defaultValue: 0
        }
    }, {
        tableName: "lifestyle",
        timestamps: false
    });
    return lifestyle;
};
