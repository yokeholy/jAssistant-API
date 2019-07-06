module.exports = function (QueryInterface, Sequelize) {
    const routineHistory = QueryInterface.define("routineHistory", {
        routineHistoryId: {
            type: Sequelize.INTEGER(10),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        routineId: {
            type: Sequelize.INTEGER(10),
            allowNull: false
        },
        historyDate: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        }
    }, {
        tableName: "routineHistory",
        timestamps: false,
        charset: "utf8",
        collate: "utf8_unicode_ci"
    });
    return routineHistory;
};
