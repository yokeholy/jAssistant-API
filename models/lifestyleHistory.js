module.exports = function (QueryInterface, Sequelize) {
    const lifestyleHistory = QueryInterface.define("lifestyleHistory", {
        lifestyleHistoryDate: {
            type: Sequelize.DATE,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.NOW
        },
        lifestyleId: {
            type: Sequelize.INTEGER(10),
            allowNull: false
        }
    }, {
        tableName: "lifestyleHistory",
        timestamps: false,
        charset: "utf8",
        collate: "utf8_unicode_ci"
    });
    return lifestyleHistory;
};
