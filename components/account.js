"use strict";
var md5 = require("md5");

const output = require("../services/output");
const Sequelize = require("sequelize");
const sequelizeInstance = require("../models").database;

const {account: Account, loginSession: LoginSession} = require("../models");

module.exports = {
    login (req, res) {
        if (!req.body.accountEmail || !req.body.accountPassword) {
            output.error(res, "Please provide account Email and Password to login.");
        } else {
            // Generate authentication key
            let authKey = md5(Date());
            output.apiOutput(res, { authKey });
        }
    }
};
