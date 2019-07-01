"use strict";
var md5 = require("md5");
var bcrypt = require("bcrypt");
const log = require("pino")();

const output = require("../services/output");
const Sequelize = require("sequelize");
const sequelizeInstance = require("../models").database;

const {user: User, loginSession: LoginSession} = require("../models");

module.exports = {
    login (req, res) {
        // Validation of login input
        if (!req.body.accountEmail || !req.body.accountPassword) {
            output.error(res, "Please provide account Email and Password to login.");
            return;
        } else {
            let userData;
            // Verify user's email
            return sequelizeInstance.transaction(t =>
                User.findOne({
                    attributes: ["userId", "userEmail", "userPassword", "userName"],
                    where: {
                        userEmail: req.body.accountEmail
                    },
                    transaction: t,
                    raw: true
                })
                    .then(result => {
                        if (result) {
                            userData = result;
                            return bcrypt.compare(req.body.accountPassword, userData.userPassword);
                        } else {
                            // User email could not be found
                            output.authError(res, "Invalid Email or Password.");
                            return;
                        }
                    })
                    .then(result => {
                        if (!result) {
                            output.authError(res, "Invalid Email or Password.");
                            return;
                        } else {
                            // User verified, create a new session and return session auth key
                            // Generate authentication key
                            let authKey = md5(Date());
                            // Store the authentication key in LoginSession table
                            LoginSession.create({
                                userId: userData.userId,
                                authKey
                            })
                                .then(() => {
                                    output.apiOutput(res, {
                                        authKey,
                                        userName: userData.userName
                                    });
                                });
                        }
                    })
            );
        }
    }
};
