module.exports = function (QueryInterface, Sequelize) {
    const user = QueryInterface.define("user", {
        userId: {
            type: Sequelize.INTEGER(10),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        userEmail: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        userPassword: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        userName: {
            type: Sequelize.STRING(100),
            allowNull: false
        }
    }, {
        tableName: "user",
        timestamps: false,
        charset: "utf8",
        collate: "utf8_unicode_ci"
    });
    return user;
};
