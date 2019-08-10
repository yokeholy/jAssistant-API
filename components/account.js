const md5 = require("md5");
const bcrypt = require("bcrypt");

const output = require("../services/output");
const sequelizeInstance = require("../database/models").database;

const {user: User, loginSession: LoginSession, settings: Settings, todoCategory: TodoCategory} = require("../database/models");

module.exports = {
    login: (req, res) => {
        // Validation of login input
        if (!req.body.accountEmail || !req.body.accountPassword) {
            return output.error(res, "Please provide account Email and Password to login.");
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
                            return output.authError(res, "Invalid Email or Password.");
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
                                .then(() =>
                                    output.apiOutput(res, {
                                        authKey,
                                        userName: userData.userName
                                    })
                                );
                        }
                    })
            );
        }
    },

    signUp: (req, res) => {
        // Validation of login input
        if (!req.body.userName || !req.body.accountEmail || !req.body.accountPassword) {
            return output.error(res, "Please provide Name, Email and Password to sign up.");
        } else {
            let authKey = md5(Date());
            let registeredUser;
            return sequelizeInstance.transaction(t =>
                User.findOne({
                    attributes: ["userId"],
                    where: {
                        userEmail: req.body.accountEmail
                    },
                    transaction: t,
                    raw: true
                })
                    .then(accountCheck => {
                        if (accountCheck) {
                            return output.error(res, "Email is already associated with another account.");
                        } else {
                            return bcrypt.hash(req.body.accountPassword, 10);
                        }
                    })
                    .then(passwordHash =>
                        User.create({
                            userName: req.body.userName,
                            userEmail: req.body.accountEmail,
                            userPassword: passwordHash
                        })
                    )
                    .then(newUser => {
                        registeredUser = newUser;
                        // User signed up, populate default data
                        // Default Settings
                        return Settings.bulkCreate([
                            {
                                settingsName: "appName",
                                settingsValue: "jAssistant",
                                ownerId: registeredUser.userId
                            }, {
                                settingsName: "todoAlertLevel",
                                settingsValue: "7",
                                ownerId: registeredUser.userId
                            }, {
                                settingsName: "todoDangerLevel",
                                settingsValue: "14",
                                ownerId: registeredUser.userId
                            }
                        ]);
                    })
                    .then(() =>
                        // Default Todo Category
                        TodoCategory.create({
                            todoCategoryName: "Default",
                            ownerId: registeredUser.userId
                        })
                    )
                    .then(() =>
                        // Create a new session and return session auth key
                        // Store the authentication key in LoginSession table
                        LoginSession.create({
                            userId: registeredUser.userId,
                            authKey
                        })
                    )
                    .then(() =>
                        output.apiOutput(res, {
                            authKey,
                            userName: registeredUser.userName
                        })
                    )
            );
        }
    },

    getAccount: (req, res) =>
        User.findOne({
            attributes: ["userName", "userEmail"],
            where: {
                userId: req.userId
            },
            raw: true
        })
            .then(userData =>
                output.apiOutput(res, {
                    userName: userData.userName,
                    accountEmail: userData.userEmail
                })
            ),

    updateAccount: (req, res) =>
        User.update({
            userName: req.body.userName,
            userEmail: req.body.accountEmail
        }, {
            where: {
                userId: req.userId
            }
        })
            .then(userData =>
                output.apiOutput(res, {
                    userName: userData.userName,
                    accountEmail: userData.userEmail
                })
            )
};
