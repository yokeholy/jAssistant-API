"use strict";

const output = require("../services/output");
const Sequelize = require("sequelize");
const sequelizeInstance = require("../database/models").database;

const Content = require("../config/content");

const {lifestyle: Lifestyle, lifestyleHistory: LifestyleHistory} = require("../database/models");

module.exports = {
    getLifestyle (req, res) {
        let lifestyles = {};
        sequelizeInstance.transaction(t =>
            Lifestyle.findAll({
                attributes: ["lifestyleId", "lifestyleName", "lifestyleCaption", "lifestyleDailyValue", "lifestyleIconName", "lifestyleColorName"],
                where: {
                    lifestyleStatus: true
                },
                transaction: t,
                raw: true
            })
                .then(data => {
                    lifestyles = data;
                    return LifestyleHistory.findAll({
                        group: ["lifestyleId"],
                        attributes: ["lifestyleId", [Sequelize.fn("count", Sequelize.col("lifestyleId")), "todayValue"]],
                        where: Sequelize.literal("DATE(lifestyleHistoryDate) = DATE(NOW())"),
                        transaction: t,
                        raw: true
                    });
                })
        )
            .then(data => {
                for (let i = 0; i < data.length; i++) {
                    for (let j = 0; j < lifestyles.length; j++) {
                        if (lifestyles[j].lifestyleId === data[i].lifestyleId) {
                            lifestyles[j].todayValue = data[i].todayValue;
                        }
                    }
                }
                return output.apiOutput(res, { lifestyles });
            });
    },

    upLifestyle (req, res) {
        if (req.body.lifestyleId) {
            LifestyleHistory.create({
                lifestyleId: req.body.lifestyleId
            })
                .then(data =>
                    output.apiOutput(res, data)
                );
        } else {
            output.error(res, "Please provide Lifestyle Id.");
        }
    },

    getLifestyleSettings (req, res) {
        let contentSettings = Content;
        sequelizeInstance.transaction(t =>
            Lifestyle.findAll({
                where: {
                    lifestyleStatus: true
                },
                transaction: t,
                raw: true
            })
                .then(lifestyleSettings =>
                    output.apiOutput(res, {
                        lifestyleSettings,
                        contentSettings
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
    }
};
