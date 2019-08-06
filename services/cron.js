const cron = require("cron").CronJob;
const log = require("pino")();

module.exports = {
    startAll () {
        this._sampleCron();
        log.info("No cron job set up.");
    },

    _sampleCron () {
        // let job = new cron("1 30 0 * * *", revenue._fetchRevenueData);
        // job.start();
    }
};
