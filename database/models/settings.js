module.exports = function (QueryInterface, Sequelize) {
    const settings = QueryInterface.define("settings", {
        settingsName: {
            type: Sequelize.STRING(100),
            allowNull: false,
            primaryKey: true
        },
        settingsValue: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        ownerId: {
            type: Sequelize.INTEGER(10),
            allowNull: false,
            defaultValue: 1
        }
    }, {
        tableName: "settings",
        timestamps: false,
        charset: "utf8",
        collate: "utf8_unicode_ci"
    });
    return settings;
};
