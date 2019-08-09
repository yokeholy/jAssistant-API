const log = require("pino")();
const output = require("../services/output");
const Sequelize = require("sequelize");
const sequelizeInstance = require("../database/models").database;

const {
    todoCategory: TodoCategory,
    settings: Settings,
    todo: Todo
} = require("../database/models");

const _verifyTodoCategoryOwnership = (todoCategoryId, userId) =>
    TodoCategory.findAll({
        where: {
            ownerId: userId,
            todoCategoryId
        }
    })
        .then(data => {
            if (data.length) {
                return Promise.resolve();
            } else {
                return Promise.reject("You don't have permission of this TodoCategory.");
            }
        })
        .catch(error => {
            log.error(`User ${userId} doesn't own TodoCategory ${todoCategoryId}: ${error}`);
            return Promise.reject(error);
        });

module.exports = {
    getAllSettings: (req, res) => {
        let generalSettings;
        sequelizeInstance.transaction(t =>
            Settings.findAll({
                where: {
                    ownerId: req.userId
                },
                transaction: t,
                raw: true
            })
                .then(generalSettingsData => {
                    generalSettings = generalSettingsData;
                    return TodoCategory.findAll({
                        attributes: ["*", [Sequelize.fn("COUNT", Sequelize.col("todo.TodoId")), "todoCount"]],
                        where: {
                            ownerId: req.userId,
                            todoCategoryStatus: true
                        },
                        include: [{
                            model: Todo,
                            attributes: [],
                            where: {
                                ownerId: req.userId,
                                todoDone: false
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

    saveGeneralSettings: (req, res) => {
        if (req.body.length) {
            Promise.all(req.body.map(settingItem =>
                Settings.update({
                    settingsValue: settingItem.settingsValue
                }, {
                    where: {
                        ownerId: req.userId,
                        settingsName: settingItem.settingsName
                    }
                })
            ))
                .then(data =>
                    output.apiOutput(res, data)
                )
                .catch(error =>
                    output.error(res, `Error saving the Settings: ${error}`)
                );
        } else {
            return output.error(res, "Please provide Settings data.");
        }
    },

    saveTodoCategorySetting: (req, res) => {
        if (req.body) {
            if (req.body.todoCategoryId) {
                return _verifyTodoCategoryOwnership(req.body.todoCategoryId, req.userId)
                    .then(() => {
                        req.body.todoCategoryUpdatedDate = new Date();
                        // This is an exiting todoCategory item, update the setting instead of creating a new one
                        return TodoCategory.update(req.body, {
                            where: {
                                todoCategoryId: req.body.todoCategoryId
                            }
                        });
                    })
                    .then(data =>
                        output.apiOutput(res, data)
                    )
                    .catch(error =>
                        output.error(res, `Error updating Todo Category: ${error}`)
                    );
            } else {
                // This is a new todoCategory item, create it
                return TodoCategory.create({
                    ownerId: req.userId,
                    todoCategoryName: req.body.todoCategoryName
                })
                    .then(data => {
                        output.apiOutput(res, data);
                    });
            }
        } else {
            return output.error(res, "Please provide Todo Category Settings data.");
        }
    },

    deleteTodoCategorySetting: (req, res) => {
        if (req.body.todoCategoryId) {
            return _verifyTodoCategoryOwnership(req.body.todoCategoryId, req.userId)
                .then(() =>
                    Todo.count({
                        where: {
                            todoCategoryId: req.body.todoCategoryId,
                            todoDone: false
                        },
                        raw: 1
                    })
                )
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
                })
                .catch(error =>
                    output.error(res, `Error deleting Todo Category: ${error}`)
                );
        } else {
            return output.error(res, "Please provide Todo Category Settings data.");
        }
    }
};
