"use strict";

const output = require("../services/output");

const {comment: Comment} = require("../database/models");

module.exports = {
    getCommentList: (req, res) => {
        if (req.body.commentType !== null && req.body.entityId !== null) {
            return Comment.findAll({
                where: {
                    commentDeleted: false,
                    commentType: req.body.commentType,
                    commentEntityId: req.body.entityId
                },
                order: [
                    ["commentId", "DESC"]
                ],
                raw: true
            })
                .then(data =>
                    output.apiOutput(res, { commentList: data })
                );
        } else {
            output.error(res, "Please provide required comment type and entity id.");
        }
    },
    createComment (req, res) {
        if (req.body.commentType !== null && req.body.entityId !== null && req.body.commentContent) {
            Comment.create({
                commentType: req.body.commentType,
                commentEntityId: req.body.entityId,
                commentContent: req.body.commentContent
            })
                .then(() =>
                    output.apiOutput(res, true)
                );
        } else {
            output.error(res, "Please provide required comment type, entity id and comment content.");
        }
    },
    deleteComment (req, res) {
        if (req.body.commentId) {
            return Comment.update({
                commentDeleted: true
            }, {
                where: {
                    commentId: req.body.commentId
                }
            })
                .then(() =>
                    output.apiOutput(res, true)
                );
        } else {
            output.error(res, "Please provide required comment id.");
        }
    }
};
