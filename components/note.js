const log = require("pino")();
const output = require("../services/output");
const Sequelize = require("sequelize");

const {note: Note} = require("../database/models");

const _verifyNoteOwnership = (noteId, userId) =>
    Note.findAll({
        where: {
            ownerId: userId,
            noteId
        }
    })
        .then(data => {
            if (data.length) {
                return Promise.resolve();
            } else {
                return Promise.reject("You don't have permission of this Note.");
            }
        })
        .catch(error => {
            log.error(`User ${userId} doesn't own Note ${noteId}: ${error}`);
            return Promise.reject(error);
        });

module.exports = {
    getNotes (req, res) {
        Note.findAll({
            where: {
                ownerId: req.userId,
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
            ownerId: req.userId,
            noteArchived: false,
            noteContent: ""
        })
            .then(() =>
                output.apiOutput(res, true)
            );
    },

    updateNote (req, res) {
        if (req.body.noteId && (req.body.noteContent || req.body.noteTitle)) {
            return _verifyNoteOwnership(req.body.noteId, req.userId)
                .then(() =>
                    Note.update({
                        noteTitle: req.body.noteTitle,
                        noteContent: req.body.noteContent,
                        noteUpdatedDate: Sequelize.literal("CURRENT_TIMESTAMP")
                    }, {
                        where: {
                            noteId: req.body.noteId
                        }
                    })
                )
                .then(data =>
                    output.apiOutput(res, data)
                )
                .catch(error =>
                    output.error(res, `Error uppping the Note: ${error}`)
                );
        } else {
            output.error(res, "Please provide Note Content or Note Title.");
        }
    },

    archiveNote (req, res) {
        return _verifyNoteOwnership(req.body.noteId, req.userId)
            .then(() =>
                Note.update({
                    noteArchived: true,
                    noteUpdatedDate: Sequelize.literal("CURRENT_TIMESTAMP")
                }, {
                    where: {
                        noteId: req.body.noteId
                    }
                })
            )
            .then(() =>
                output.apiOutput(res, true)
            )
            .catch(error =>
                output.error(res, `Error archiving the Note: ${error}`)
            );
    },

    getArchivedNotes (req, res) {
        Note.findAll({
            where: {
                ownerId: req.userId,
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
