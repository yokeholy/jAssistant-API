module.exports = function (QueryInterface, Sequelize) {
    const lifestyle = QueryInterface.define("lifestyle", {
        lifestyleId: {
            type: Sequelize.INTEGER(10),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        lifestyleStatus: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        lifestyleName: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        lifestyleCaption: {
            type: Sequelize.TEXT,
            allowNull: false,
            defaultValue: ""
        },
        lifestyleIconName: {
            type: Sequelize.TEXT,
            allowNull: false,
            defaultValue: "success"
        },
        lifestyleColorName: {
            type: Sequelize.TEXT,
            allowNull: false,
            defaultValue: "tint"
        },
        lifestyleDailyValue: {
            type: Sequelize.INTEGER(2),
            allowNull: false,
            defaultValue: 1
        },
        lifestyleCreatedDate: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        lifestyleUpdatedDate: {
            type: Sequelize.DATE,
            allowNull: true
        }
    }, {
        tableName: "lifestyle",
        timestamps: false,
        charset: "utf8",
        collate: "utf8_unicode_ci"
    });
    return lifestyle;
};
