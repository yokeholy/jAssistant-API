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
        let errorMessage = `Error: ${message}`;
        log.error(`API ERROR - Error message sent to user: "${errorMessage}"`);
        res.status(400)
            .json({
                metadata: {
                    status: false,
                    version: currentVersion,
                    message: errorMessage
                },
                data: null
            })
            .end();
    },

    authError (res, message) {
        let errorMessage = `Authentication Error: ${message}`;
        log.error(`AUTHENTICATION ERROR - Error message sent to user: "${errorMessage}"`);
        res.status(401)
            .json({
                metadata: {
                    status: false,
                    version: currentVersion,
                    message: errorMessage
                },
                data: null
            })
            .end();
    },

    systemError (res, message) {
        let errorMessage = `System Error: ${message}`;
        log.error(`SYSTEM ERROR - Error message sent to user: "${errorMessage}"`);
        // Send Status 500 and end the response.
        res.status(500)
            .json({
                metadata: {
                    status: false,
                    version: currentVersion,
                    error: errorMessage
                },
                data: null
            })
            .end();
    }
};
