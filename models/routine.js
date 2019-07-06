module.exports = function (QueryInterface, Sequelize) {
    const routine = QueryInterface.define("routine", {
        routineId: {
            type: Sequelize.INTEGER(10),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        routineName: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        routineActive: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        routineConsecutive: {
            type: Sequelize.INTEGER(6),
            allowNull: false,
            defaultValue: 0
        },
        routineCreatedDate: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        routineUpdatedDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        routineLastCheckInDate: {
            type: Sequelize.DATE,
            allowNull: true
        }
    }, {
        tableName: "routine",
        timestamps: false,
        charset: "utf8",
        collate: "utf8_unicode_ci"
    });
    routine.associate = function (models) {
        routine.hasOne(models.comment, {
            foreignKey: "commentEntityId"
        });
    };
    return routine;
};
