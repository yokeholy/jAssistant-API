"use strict";

const output = require("../services/output");
const Sequelize = require("sequelize");

const {lifestyle: Lifestyle} = require("../models");

module.exports = {
    getAllSettings (req, res) {
        Lifestyle.findAll({ raw: true })
            .then(function (data) {
                let lifestyleSettings = data;
                output.apiOutput(res, {lifestyleSettings});
            });
    },
    saveLifestyleSetting (req, res) {
        if (req.body) {
            const setting = req.body;
            if (setting.lifestyleId) {
                // This is an exiting lifestyle item, update the setting instead of creating a new one
                Lifestyle.update({
                    lifestyleName: setting.lifestyleName,
                    lifestyleDailyValue: setting.lifestyleDailyValue,
                    lifestyleUpdatedDate: Sequelize.literal("NOW()")
                }, {
                    where: {
                        lifestyleId: setting.lifestyleId
                    }
                })
                    .then(function (data) {
                        output.apiOutput(res, data);
                    });
            } else {
                // This is a new lifestyle item, create it
                Lifestyle.create({
                    lifestyleName: setting.lifestyleName,
                    lifestyleDailyValue: setting.lifestyleDailyValue
                })
                    .then(function (data) {
                        output.apiOutput(res, data);
                    });
            }
        } else {
            output.error(res, "Please provide Lifestyle Settings data.");
        }
    }
};
