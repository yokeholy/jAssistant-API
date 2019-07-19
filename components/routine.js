"use strict";

const output = require("../services/output");
const Sequelize = require("sequelize");
const sequelizeInstance = require("../database/models").database;

const moment = require("moment");

const {routine: Routine, routineHistory: RoutineHistory, comment: Comment} = require("../database/models");

const _getNextDueDayCountdown = (frequencyType, frequencyValue, lastCheckInDate) => {
    if (!lastCheckInDate) {
        return 0;
    } else {
        let today = moment(new Date()).startOf("day");
        let now = moment(new Date());
        lastCheckInDate = moment(lastCheckInDate).startOf("day");
        let nextDueDay;

        switch (frequencyType) {
        // Monthly routine
        case 3:
            // Get the next due day
            let nextDueMonth = lastCheckInDate.date() <= frequencyValue ? 1 : 2;
            nextDueDay = lastCheckInDate.date(frequencyValue).add(nextDueMonth, "M");
            if (today <= nextDueDay) {
                return moment.duration(nextDueDay.endOf("day").diff(now)).asSeconds();
            } else if (today > nextDueDay) {
                return -1;
            }
            break;
        // Weekly routine
        case 2:
            // Get the next due day
            let nextDueWeek = lastCheckInDate.day() <= frequencyValue ? 1 : 2;
            nextDueDay = lastCheckInDate.day(frequencyValue).add(nextDueWeek, "W");
            if (today <= nextDueDay) {
                return moment.duration(nextDueDay.endOf("day").diff(now)).asSeconds();
            } else if (today > nextDueDay) {
                return -1;
            }
            break;
        // Weekly routine
        case 1:
            // Translate frequency value into an array of days of the week
            let frequencyDays = [];
            let frequencyArray = frequencyValue.split("");
            for (let i = 0; i < frequencyArray.length; i++) {
                frequencyDays.push(parseInt(frequencyArray[i], 10));
            }
            while (!frequencyDays[lastCheckInDate.day()]) {
                lastCheckInDate.date(lastCheckInDate.date() + 1);
            }
            // Get the next due day
            nextDueDay = lastCheckInDate;
            if (today <= nextDueDay) {
                return moment.duration(nextDueDay.endOf("day").diff(now)).asSeconds();
            } else if (today > nextDueDay) {
                return -1;
            }
            break;
        }
    }
};

module.exports = {
    getRoutineList (req, res) {
        Routine.findAll({
            attributes: [
                "*",
                Sequelize.literal("IF(DATEDIFF(CURRENT_TIMESTAMP, routineLastCheckInDate) < 1, 1, 0) AS routineCheckedIn"),
                [Sequelize.fn("COUNT", Sequelize.col("comment.commentId")), "commentCount"]
            ],
            where: {
                routineActive: true
            },
            include: [{
                model: Comment,
                attributes: [],
                where: {
                    commentType: 2,
                    commentDeleted: 0
                },
                required: false
            }],
            group: ["routine.routineId"],
            raw: true
        }).then(routineData => {
            for (let i = 0; i < routineData.length; i++) {
                let routine = routineData[i];
                if (routine.routineFrequencyType === 1) {
                    // Convert Routine Frequency Value from base-10 to binary string
                    routine.routineFrequencyValue = routine.routineFrequencyValue.toString(2).padStart(7, "0");
                }
                // Get the next due day in seconds (for countdown purposes in the UI)
                routine.nextDueDayCountdown = _getNextDueDayCountdown(
                    routine.routineFrequencyType,
                    routine.routineFrequencyValue,
                    routine.routineLastCheckInDate
                );
                routine.routineConsecutive = routine.nextDueDayCountdown > 0 ? routine.routineConsecutive : 0;
            }
            return output.apiOutput(res, {routineList: routineData});
        });
    },

    createRoutine (req, res) {
        // Validation
        if (req.body.newRoutine) {
            Routine.create({
                routineName: req.body.newRoutine
            })
                .then(() =>
                    output.apiOutput(res, true)
                );
        } else {
            output.error(res, "Please provide the Routine Name.");
        }
    },

    updateRoutine (req, res) {
        if (req.body.routineId && req.body.routineName) {
            Routine.update({
                routineName: req.body.routineName
            }, {
                where: {
                    routineId: req.body.routineId
                }
            })
                .then(() =>
                    output.apiOutput(res, true)
                );
        } else {
            output.error(res, "Please provide the Routine ID.");
        }
    },

    updateRoutineConfig (req, res) {
        if (req.body.routineId && req.body.frequencyConfig) {
            let routineFrequencyType = req.body.frequencyConfig.periodType;
            let routineFrequencyValue;
            if (routineFrequencyType === 1) {
                // Convert Routine Frequency Value from binary string to base-10 integer
                routineFrequencyValue = parseInt(req.body.frequencyConfig.dailyFrequency, 2);
            } else if (routineFrequencyType === 2) {
                routineFrequencyValue = req.body.frequencyConfig.weeklyDay;
            } else if (routineFrequencyType === 3) {
                routineFrequencyValue = req.body.frequencyConfig.monthlyDay;
            }
            Routine.update({
                routineFrequencyType,
                routineFrequencyValue
            }, {
                where: {
                    routineId: req.body.routineId
                }
            })
                .then(() =>
                    output.apiOutput(res, true)
                );
        } else {
            output.error(res, "Please provide the Routine ID and Routine Config data.");
        }
    },

    checkInRoutine (req, res) {
        if (req.body.routineId) {
            // Check if this routine has been checked in today already
            Routine.findOne({
                where: {
                    routineId: req.body.routineId,
                    routineLastCheckInDate: {
                        [Sequelize.Op.ne]: null
                    },
                    [Sequelize.Op.and]: Sequelize.literal("DATEDIFF(CURRENT_TIMESTAMP, routineLastCheckInDate) < 1")
                }
            })
                .then(result => {
                    if (!result) {
                        sequelizeInstance.transaction(
                            t => Routine.update({
                                routineConsecutive: Sequelize.literal("IF(DATEDIFF(CURRENT_TIMESTAMP, routineLastCheckInDate) = 1, routineConsecutive + 1, 1)"),
                                routineLastCheckInDate: Sequelize.literal("CURRENT_TIMESTAMP")
                            }, {
                                where: {
                                    routineId: req.body.routineId
                                }
                            }, {transaction: t})
                                .then(() => RoutineHistory.create({
                                    routineId: req.body.routineId
                                }, {transaction: t}))
                        )
                            .then(() => {
                                output.apiOutput(res, true);
                            });
                    } else {
                        output.error(res, "This routine has already been checked in today.");
                    }
                });
        } else {
            output.error(res, "Please provide the Routine ID.");
        }
    },

    deleteRoutine (req, res) {
        if (req.body.routineId) {
            Routine.update({
                routineActive: false
            }, {
                where: {
                    routineId: req.body.routineId
                }
            })
                .then(() =>
                    output.apiOutput(res, true)
                );
        } else {
            output.error(res, "Please provide the Routine ID.");
        }
    }
};
