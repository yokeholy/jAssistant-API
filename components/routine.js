"use strict";

const output = require("../services/output");
const Sequelize = require("sequelize");
const sequelizeInstance = require("../models").database;

const {routine: Routine, routineHistory: RoutineHistory} = require("../models");

module.exports = {
    getRoutineList (req, res) {
        Routine.findAll({
            attributes: [
                "*",
                Sequelize.literal("IF(DATEDIFF(CURRENT_TIMESTAMP, routineLastCheckInDate) < 1, 1, 0) AS routineCheckedIn")
            ],
            where: {
                routineActive: true
            },
            raw: true
        }).then(data =>
            output.apiOutput(res, {routineList: data})
        );
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
