const fs = require("fs");

module.exports = {
    port: 3333,
    authKey: "1234567890abcdefghijklmnopq",
    key: fs.readFileSync("./ssl/sample.key"),
    cert: fs.readFileSync("./ssl/sample.pem")
};
