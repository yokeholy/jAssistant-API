"use strict";

const output = require("../services/output");
const Sequelize = require("sequelize");
const sequelizeInstance = require("../models").database;

const {lifestyle: Lifestyle, lifestyleHistory: LifestyleHistory} = require("../models");

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
    }
};
