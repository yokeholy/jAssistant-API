"use strict";

const output = require("../services/output");
const log = require("pino")();
const Sequelize = require("sequelize");

const {note: Note} = require("../models");

module.exports = {
    getNote (req, res) {
        Note.findOrCreate({
            where: {
                noteArchived: false
            },
            defaults: {
                noteContent: ""
            },
            order: [
                ["noteId", "DESC"]
            ]
        }).then(function (data) {
            if (data) {
                output.apiOutput(res, {note: data[0].noteContent});
            } else {
                output.apiOutput(res, []);
            }
        });
    },
    updateNote (req, res) {
        if (req.body.noteContent) {
            Note.update({
                noteContent: req.body.noteContent,
                noteUpdatedDate: Sequelize.literal("CURRENT_TIMESTAMP")
            }, {
                where: {
                    noteArchived: false
                }
            }).then(function (data) {
                output.apiOutput(res, data);
            });
        } else {
            output.error(res, "Please provide Note Content.");
        }
    },
    archiveNote (req, res) {
        Note.update({
            noteArchived: true,
            noteUpdatedDate: Sequelize.literal("CURRENT_TIMESTAMP")
        }, {
            where: {
                noteArchived: false
            }
        });
        Note.create({
            noteArchived: false,
            noteContent: ""
        })
            .then(function () {
                output.apiOutput(res, true);
            });
    }
};
