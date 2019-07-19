"use strict";

module.exports = {
    up: QueryInterface =>
        QueryInterface.bulkInsert("settings", [{
            settingsName: "todoAlertLevel",
            settingsValue: "7"
        }, {
            settingsName: "todoDangerLevel",
            settingsValue: "14"
        }]),

    down: (QueryInterface, Sequelize) =>
        QueryInterface.bulkDelete("settings", {
            [Sequelize.Op.or]: [
                {settingsName: "todoAlertLevel"},
                {settingsName: "todoDangerLevel"}
            ]
        })
};
