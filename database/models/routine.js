module.exports = function (QueryInterface, Sequelize) {
    const routine = QueryInterface.define("routine", {
        routineId: {
            type: Sequelize.INTEGER(10),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        ownerId: {
            type: Sequelize.INTEGER(10),
            allowNull: false,
            defaultValue: 1
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
        routineFrequencyType: {
            type: Sequelize.INTEGER(1),
            allowNull: false,
            defaultValue: 1,
            comment: "1: daily, 2: weekly, 3: monthly"
        },
        routineFrequencyValue: {
            type: Sequelize.INTEGER(3),
            allowNull: false,
            defaultValue: 127,
            comment: "For daily: it's stored as base 10 integer which represents a binary value of a 7-bit length string. i.e. 127 means '1111111' which means every day of the week."
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
