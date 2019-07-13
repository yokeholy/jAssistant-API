"use strict";

const output = require("../services/output");
const Sequelize = require("sequelize");
const sequelizeInstance = require("../models").database;

const Content = require("../config/content");
const {lifestyle: Lifestyle, todoCategory: TodoCategory, todo: Todo} = require("../models");

module.exports = {
    getAllSettings (req, res) {
        let contentSettings = Content;
        let lifestyleSettings;
        sequelizeInstance.transaction(t =>
            Lifestyle.findAll({
                where: {
                    lifestyleStatus: true
                },
                transaction: t,
                raw: true
            })
                .then(data => {
                    lifestyleSettings = data;
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
                        lifestyleSettings,
                        contentSettings,
                        todoCategorySettings: todoCategoryData
                    })
                )
        );
    },
    saveLifestyleSetting (req, res) {
        if (req.body) {
            const setting = req.body;
            if (setting.lifestyleId) {
                req.body.lifestyleUpdatedDate = new Date();
                // This is an exiting lifestyle item, update the setting instead of creating a new one
                Lifestyle.update(req.body, {
                    where: {
                        lifestyleId: setting.lifestyleId
                    }
                })
                    .then(data =>
                        output.apiOutput(res, data)
                    );
            } else {
                // This is a new lifestyle item, create it
                Lifestyle.create({
                    lifestyleName: setting.lifestyleName,
                    lifestyleDailyValue: setting.lifestyleDailyValue
                })
                    .then(data => {
                        output.apiOutput(res, data);
                    });
            }
        } else {
            output.error(res, "Please provide Lifestyle Settings data.");
        }
    },
    deleteLifestyleSetting (req, res) {
        if (req.body.lifestyleId) {
            Lifestyle.update({
                lifestyleStatus: false
            }, {
                where: {
                    lifestyleId: req.body.lifestyleId
                }
            })
                .then(() =>
                    output.apiOutput(res, true)
                );
        } else {
            output.error(res, "Please provide Lifestyle Settings data.");
        }
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
    }
};
