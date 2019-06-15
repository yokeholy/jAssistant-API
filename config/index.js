/* eslint no-process-env: 0 */
"use strict";

const ENV = process.env.NODE_ENV || "development";
const path = require("path");

const envConfig = require(path.join(__dirname, ENV));

const config = Object.assign({
    env: ENV
}, envConfig);

module.exports = config;
