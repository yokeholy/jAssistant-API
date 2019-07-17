"use strict";

const output = require("../services/output");
const Sequelize = require("sequelize");
const sequelizeInstance = require("../database/models").database;

const {routine: Routine, routineHistory: RoutineHistory, comment: Comment} = require("../database/models");

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
                if (routineData[i].routineFrequencyType === 1) {
                    // Convert Routine Frequency Value from base-10 to binary string
                    routineData[i].routineFrequencyValue = routineData[i].routineFrequencyValue.toString(2).padStart(7, "0");
                }
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
