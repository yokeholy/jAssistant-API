"use strict";

const ModelsLoader = require("../utils/ModelsLoader");
const Sequelize = require("sequelize");
const config = require("../config/database.json");
const log = require("pino")();
if (config) {
    const sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        {
            host: config.host,
            port: config.port,
            dialect: config.dialect,
            define: {
                charset: "utf8",
                collate: "utf8_general_ci",
                timestamps: false
            },
            timezone: "America/Chicago",
            dialectOptions: {
                dateStrings: true,
                typeCast: (field, next) => {
                    if (field.type === "DATETIME") {
                        return field.string();
                    }
                    return next();
                },
            },
            logging: false
        }
    );
    module.exports = ModelsLoader.load({
        sequelize,
        baseFolder: __dirname
    });
    sequelize.sync();
    log.info("Database connected.");
} else {
    log.error("Database configuration not found, disabling database.");
}
