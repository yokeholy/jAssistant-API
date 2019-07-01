module.exports = function (queryInterface, Sequelize) {
    const loginSession = queryInterface.define("loginSession", {
        loginSessionId: {
            type: Sequelize.INTEGER(10),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: Sequelize.INTEGER(10),
            allowNull: false
        },
        authKey: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        sessionTime: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: queryInterface.literal("CURRENT_TIMESTAMP")
        }
    }, {
        tableName: "loginSession",
        timestamps: false,
        charset: "utf8",
        collate: "utf8_unicode_ci"
    });
    return loginSession;
};
