"use strict";

const output = require("../services/output");
const log = require("pino")();
const Sequelize = require("sequelize");
const sequelizeInstance = require("../models").database;

const {lifestyle: Lifestyle, lifestyleHistory: LifestyleHistory, configuration: Configuration} = require("../models");

module.exports = {
    getLifestyle (req, res) {
        let lifestyleData;
        sequelizeInstance.transaction(t =>
            Lifestyle.findOrCreate({
                attributes: ["water", "standing", "workout"],
                where: {
                    lifestyleDate: Sequelize.literal("lifestyleDate = CURDATE()")
                },
                defaults: {
                    lifestyleDate: Sequelize.literal("CURDATE()")
                },
                transaction: t
            })
                .then(function (data) {
                    lifestyleData = data[0];
                    return Configuration.findAll({transaction: t});
                })
        )
            .then(function (data) {
                let lifestyleConfig = {};
                for (let item = 0; item < data.length; item++) {
                    lifestyleConfig[data[item].configurationItem] = parseInt(data[item].configurationValue, 10);
                }
                output.apiOutput(res, {lifestyles: lifestyleData, lifestyleConfig});
            });
    },
    upLifestyle (req, res) {
        if (req.body.type) {
            sequelizeInstance.transaction(t =>
                Lifestyle.update({
                    water: req.body.type === "water" ? Sequelize.literal("water + 1") : Sequelize.literal("water"),
                    standing: req.body.type === "standing" ? Sequelize.literal("standing + 1") : Sequelize.literal("standing"),
                    workout: req.body.type === "workout" ? Sequelize.literal("workout + 1") : Sequelize.literal("workout")
                }, {
                    where: {
                        lifestyleDate: Sequelize.literal("lifestyleDate = CURDATE()")
                    },
                    transaction: t
                })
                    .then(() =>
                        LifestyleHistory.create({lifestyleType: req.body.type})
                    )
            )
                .then(function (data) {
                    output.apiOutput(res, data);
                });
        } else {
            output.error(res, "Please provide Lifestyle Type.");
        }
    }
};
