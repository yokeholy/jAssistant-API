"use strict";

const output = require("../services/output");
const Sequelize = require("sequelize");
const sequelizeInstance = require("../database/models").database;

const {
    todoCategory: TodoCategory,
    settings: Settings,
    todo: Todo
} = require("../database/models");

module.exports = {
    getAllSettings (req, res) {
        let generalSettings;
        sequelizeInstance.transaction(t =>
            Settings.findOrCreate({
                where: {
                    settingsName: "appName"
                },
                defaults: {
                    settingsName: "appName",
                    settingsValue: "jAssistant"
                },
                transaction: t
            })
                .then(([generalSettingsData]) => {
                    generalSettings = [generalSettingsData];
                    return TodoCategory.findAll({
                        attributes: ["*", [Sequelize.fn("COUNT", Sequelize.col("todo.TodoId")), "todoCount"]],
                        where: {
                            todoCategoryStatus: true
                        },
                        include: [{
                            model: Todo,
                            attributes: [],
                            where: {
                                todoStatus: false
                            },
                            required: false
                        }],
                        group: ["todoCategory.todoCategoryId"],
                        transaction: t,
                        raw: true
                    });
                })
                .then(todoCategoryData =>
                    output.apiOutput(res, {
                        generalSettings,
                        todoCategorySettings: todoCategoryData
                    })
                )
        );
    },
    saveTodoCategorySetting (req, res) {
        if (req.body) {
            const setting = req.body;
            if (setting.todoCategoryId) {
                req.body.todoCategoryUpdatedDate = new Date();
                // This is an exiting todoCategory item, update the setting instead of creating a new one
                TodoCategory.update(req.body, {
                    where: {
                        todoCategoryId: setting.todoCategoryId
                    }
                })
                    .then(data =>
                        output.apiOutput(res, data)
                    );
            } else {
                // This is a new todoCategory item, create it
                TodoCategory.create({
                    todoCategoryName: setting.todoCategoryName,
                    todoCategoryDailyValue: setting.todoCategoryDailyValue
                })
                    .then(data => {
                        output.apiOutput(res, data);
                    });
            }
        } else {
            output.error(res, "Please provide Todo Category Settings data.");
        }
    },
    deleteTodoCategorySetting (req, res) {
        if (req.body.todoCategoryId) {
            return Todo.count({
                where: {
                    todoCategoryId: req.body.todoCategoryId,
                    todoStatus: false
                },
                raw: 1
            })
                .then(todoCountData => {
                    if (todoCountData > 0) {
                        return output.error(res, "This Todo Category has more than 0 unfinished Todo items. Thus deleting it is not allowed.");
                    } else {
                        return TodoCategory.update({
                            todoCategoryStatus: false,
                            todoCategoryUpdatedDate: new Date()
                        }, {
                            where: {
                                todoCategoryId: req.body.todoCategoryId
                            }
                        })
                            .then(() =>
                                output.apiOutput(res, true)
                            );
                    }
                });
        } else {
            return output.error(res, "Please provide Todo Category Settings data.");
        }
    },
    saveGeneralSettings (req, res) {
        if (req.body.length) {
            const settings = req.body;
            return Promise.all(settings.map(settingItem =>
                Settings.update({
                    settingsValue: settingItem.settingsValue
                }, {
                    where: {
                        settingsName: settingItem.settingsName
                    }
                })
            ))
                .then(data =>
                    output.apiOutput(res, data)
                );
        } else {
            return output.error(res, "Please provide Settings data.");
        }
    }
};
