module.exports = function (QueryInterface, Sequelize) {
    const configuration = QueryInterface.define("configuration", {
        configurationItem: {
            type: Sequelize.STRING(100),
            allowNull: false,
            primaryKey: true
        },
        configurationValue: {
            type: Sequelize.STRING(100),
            allowNull: false
        }
    }, {
        tableName: "configuration",
        timestamps: false,
        charset: "utf8",
        collate: "utf8_unicode_ci"
    });
    return configuration;
};
