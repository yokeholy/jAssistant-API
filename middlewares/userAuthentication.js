const output = require("../services/output");
const {loginSession: LoginSession} = require("../database/models");

module.exports = (req, res, next) =>
    LoginSession.findOne({
        where: {
            authKey: req.get("UserAuthKey")
        },
        raw: true
    })
        .then(userData => {
            if (userData) {
                req.userId = userData.userId;
                return next();
            } else {
                return output.authError(res, "Authentication failed.");
            }
        });
