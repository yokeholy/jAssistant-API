const md5 = require("md5");
const bcrypt = require("bcrypt");

const output = require("../services/output");
const sequelizeInstance = require("../database/models").database;

const {user: User, loginSession: LoginSession} = require("../database/models");

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
            let registeredAccount;
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
                    .then(newAccount => {
                        registeredAccount = newAccount;
                        // User signed up, create a new session and return session auth key
                        // Store the authentication key in LoginSession table
                        return LoginSession.create({
                            userId: newAccount.userId,
                            authKey
                        });
                    })
                    .then(() =>
                        output.apiOutput(res, {
                            authKey,
                            userName: registeredAccount.userName
                        })
                    )
            );
        }
    }
};
