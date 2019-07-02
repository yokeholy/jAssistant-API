"use strict";

const currentVersion = "1.0.0";
const log = require("pino")();

module.exports = {
    apiOutput (res, data) {
        // Successful API execution
        res.json({
            metadata: {
                status: true,
                version: currentVersion,
            },
            data: data ? data : true
        }).end();
    },

    error (res, message) {
        // Successful API execution
        res.json({
            metadata: {
                status: false,
                version: currentVersion,
                message
            }
        }).end();
    },

    authError (res, message) {
        log.error(`AUTHENTICATION ERROR: ${message}`);
        res.status(401)
            .json({
                metadata: {
                    status: false,
                    version: currentVersion,
                    message
                },
                data: null
            })
            .end();
    },

    systemError (res, message) {
        log.error(`SYSTEM ERROR: ${message}`);
        // Send Status 500 and end the response.
        res.status(500)
            .json({
                metadata: {
                    status: false,
                    version: currentVersion,
                    message
                },
                data: null
            })
            .end();
    }
};
