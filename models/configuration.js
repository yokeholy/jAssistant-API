module.exports = function (sequelize, DataTypes) {
    const configuration = sequelize.define("configuration", {
        configurationItem: {
            type: DataTypes.STRING(100),
            allowNull: false,
            primaryKey: true
        },
        configurationValue: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    }, {
        tableName: "configuration",
        timestamps: false
    });
    return configuration;
};
