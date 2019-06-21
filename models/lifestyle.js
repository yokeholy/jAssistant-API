module.exports = function (sequelize, DataTypes) {
    const lifestyle = sequelize.define("lifestyle", {
        lifestyleId: {
            type: DataTypes.INTEGER(10),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        lifestyleStatus: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        lifestyleName: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        lifestyleCaption: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: ""
        },
        lifestyleIconName: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: "success"
        },
        lifestyleColorName: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: "tint"
        },
        lifestyleDailyValue: {
            type: DataTypes.INTEGER(2),
            allowNull: false,
            defaultValue: 1
        },
        lifestyleCreatedDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
        },
        lifestyleUpdatedDate: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: "lifestyle",
        timestamps: false
    });
    return lifestyle;
};
