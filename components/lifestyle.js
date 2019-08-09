const log = require("pino")();
const output = require("../services/output");
const Sequelize = require("sequelize");
const sequelizeInstance = require("../database/models").database;

const Content = require("../config/content");

const {lifestyle: Lifestyle, lifestyleHistory: LifestyleHistory} = require("../database/models");

const _verifyLifestyleOwnership = (lifestyleId, userId) =>
    Lifestyle.findAll({
        where: {
            ownerId: userId,
            lifestyleId
        }
    })
        .then(data => {
            if (data.length) {
                return Promise.resolve();
            } else {
                return Promise.reject("You don't have permission of this Lifestyle.");
            }
        })
        .catch(error => {
            log.error(`User ${userId} doesn't own Lifestyle ${lifestyleId}: ${error}`);
            return Promise.reject(error);
        });

module.exports = {
    getLifestyle: (req, res) => {
        let lifestyles = {};
        sequelizeInstance.transaction(t =>
            Lifestyle.findAll({
                attributes: ["lifestyleId", "lifestyleName", "lifestyleCaption", "lifestyleDailyValue", "lifestyleIconName", "lifestyleColorName"],
                where: {
                    ownerId: req.userId,
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

    upLifestyle: (req, res) => {
        if (req.body.lifestyleId) {
            return _verifyLifestyleOwnership(req.body.lifestyleId, req.userId)
                .then(() =>
                    LifestyleHistory.create({
                        lifestyleId: req.body.lifestyleId
                    })
                )
                .then(data =>
                    output.apiOutput(res, data)
                )
                .catch(error =>
                    output.error(res, `Error uppping the Lifestyle: ${error}`)
                );
        } else {
            output.error(res, "Please provide Lifestyle Id.");
        }
    },

    getLifestyleSettings: (req, res) => {
        let contentSettings = Content;
        sequelizeInstance.transaction(t =>
            Lifestyle.findAll({
                where: {
                    ownerId: req.userId,
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

    saveLifestyleSetting: (req, res) => {
        if (req.body) {
            if (req.body.lifestyleId) {
                req.body.lifestyleUpdatedDate = new Date();
                return _verifyLifestyleOwnership(req.body.lifestyleId, req.userId)
                    .then(() =>
                    // This is an exiting lifestyle item, update the setting instead of creating a new one
                        Lifestyle.update(req.body, {
                            where: {
                                lifestyleId: req.body.lifestyleId
                            }
                        })
                    )
                    .then(data =>
                        output.apiOutput(res, data)
                    )
                    .catch(error =>
                        output.error(res, `Error saving Lifestyle settings: ${error}`)
                    );
            } else {
                // This is a new lifestyle item, create it
                Lifestyle.create({
                    ownerId: req.userId,
                    lifestyleName: req.body.lifestyleName,
                    lifestyleDailyValue: req.body.lifestyleDailyValue
                })
                    .then(data => {
                        output.apiOutput(res, data);
                    });
            }
        } else {
            output.error(res, "Please provide Lifestyle Settings data.");
        }
    },

    deleteLifestyleSetting: (req, res) => {
        if (req.body.lifestyleId) {
            return _verifyLifestyleOwnership(req.body.lifestyleId, req.userId)
                .then(() =>
                    Lifestyle.update({
                        lifestyleStatus: false
                    }, {
                        where: {
                            lifestyleId: req.body.lifestyleId
                        }
                    })
                )
                .then(() =>
                    output.apiOutput(res, true)
                )
                .catch(error =>
                    output.error(res, `Error deleting Lifestyle: ${error}`)
                );
        } else {
            output.error(res, "Please provide Lifestyle Settings data.");
        }
    }
};
