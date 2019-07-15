"use strict";

const output = require("../services/output");
const Sequelize = require("sequelize");

const {note: Note} = require("../database/models");

module.exports = {
    getNotes (req, res) {
        Note.findAll({
            where: {
                noteArchived: false
            },
            order: [
                ["noteId", "DESC"]
            ],
            raw: true
        })
            .then(data =>
                output.apiOutput(res, data ? { noteList: data } : [])
            );
    },
    createNote (req, res) {
        Note.create({
            noteArchived: false,
            noteContent: ""
        })
            .then(() =>
                output.apiOutput(res, true)
            );
    },
    updateNote (req, res) {
        if (req.body.noteId && (req.body.noteContent || req.body.noteTitle)) {
            Note.update({
                noteTitle: req.body.noteTitle,
                noteContent: req.body.noteContent,
                noteUpdatedDate: Sequelize.literal("CURRENT_TIMESTAMP")
            }, {
                where: {
                    noteId: req.body.noteId
                }
            })
                .then(data =>
                    output.apiOutput(res, data)
                );
        } else {
            output.error(res, "Please provide Note Content or Note Title.");
        }
    },
    archiveNote (req, res) {
        Note.update({
            noteArchived: true,
            noteUpdatedDate: Sequelize.literal("CURRENT_TIMESTAMP")
        }, {
            where: {
                noteId: req.body.noteId
            }
        })
            .then(() =>
                output.apiOutput(res, true)
            );
    },
    getArchivedNotes (req, res) {
        Note.findAll({
            where: {
                noteArchived: true
            },
            order: [
                ["noteId", "DESC"]
            ],
            raw: true
        })
            .then(data =>
                output.apiOutput(res, data ? { archivedNoteList: data } : [])
            );
    }
};
