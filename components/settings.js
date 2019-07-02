"use strict";

const output = require("../services/output");
const Sequelize = require("sequelize");

const Content = require("../config/content");
const {lifestyle: Lifestyle} = require("../models");

module.exports = {
    getAllSettings (req, res) {
        let contentSettings = Content;
        Lifestyle.findAll({
            where: {
                lifestyleStatus: true
            },
            raw: true
        })
            .then(data =>
                output.apiOutput(res, {lifestyleSettings: data, contentSettings})
            );
    },
    saveLifestyleSetting (req, res) {
        if (req.body) {
            const setting = req.body;
            if (setting.lifestyleId) {
                req.body.lifestyleUpdatedDate = Sequelize.literal("NOW()");
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
