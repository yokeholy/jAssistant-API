"use strict";

const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const config = require("../config/");
const log = require("pino")();

const cronService = require("../services/cron");

const jAssistantAPI = express();

const listener = https.createServer({
    key: config.key,
    cert: config.cert
}, jAssistantAPI)
    .listen(config.port);

require("../database/models");

process.on("unhandledRejection", error => {
    log.error(`unhandledRejection: ${error.message}`);
});

jAssistantAPI.use(bodyParser.json());
jAssistantAPI.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Request methods you wish to allow
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    // Request headers you wish to allow
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type,Authorization, UserAuthKey");

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", true);

    // Intercepts OPTIONS method
    if (req.method === "OPTIONS") {
        //respond with 200
        res.sendStatus(200)
            .end();
    }

    // Simple authorization method
    else if (req.get("Authorization") !== config.authKey) {
        res.sendStatus(403)
            .end();
    } else {
        log.info(`Request ${req.originalUrl} is being called.`);
        return next();
    }
});

require("./routes")(jAssistantAPI);

// If the router is not found, send out 404
jAssistantAPI.use((req, res) => {
    log.warn(`Attempt of ${req.originalUrl} failed.`);
    res.status(404).json({
        status: 404,
        message: "Can not find the API"
    })
        .end();
});


log.info(`
*****************************
**                         **
** jAssistant API Starting **
**          HTTPS          **
**        Port ${listener.address().port}        **
**                         **
*****************************`);

cronService.startAll();

module.exports = jAssistantAPI;
