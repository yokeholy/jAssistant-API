const log = require("pino")();
const output = require("../services/output");

const {comment: Comment, todo: Todo, routine: Routine} = require("../database/models");

const _verifyCommentOwnership = (commentId, userId) =>
    Comment.findAll({
        where: {
            ownerId: userId,
            commentId
        }
    })
        .then(data => {
            if (data.length) {
                return Promise.resolve();
            } else {
                return Promise.reject("You don't have permission of this Comment.");
            }
        })
        .catch(error => {
            log.error(`User ${userId} doesn't own Comment ${commentId}: ${error}`);
            return Promise.reject(error);
        });

const _verifyEntityOwnership = (entityType, entityId, userId) => {
    // Verify the user has ownership of the entity (todo or routine)
    if (entityType === 1) {
        return Todo.findAll({
            where: {
                ownerId: userId,
                todoId: entityId
            }
        })
            .then(data => {
                if (data.length) {
                    return Promise.resolve();
                } else {
                    return Promise.reject("You don't have permission of this Todo.");
                }
            })
            .catch(error => {
                log.error(`Error getting Todo Comment list for user ${userId} on Todo ${entityId}: ${error}`);
                return Promise.reject(error);
            });
    } else if (entityType === 2) {
        return Routine.findAll({
            where: {
                ownerId: userId,
                routineId: entityId
            }
        })
            .then(data => {
                if (data.length) {
                    return Promise.resolve();
                } else {
                    return Promise.reject("You don't have permission of this Routine.");
                }
            })
            .catch(error => {
                log.error(`Error getting Routine Comment list for user ${userId} on Routine ${entityId}: ${error}`);
                return Promise.reject(error);
            });
    } else {
        return Promise.reject("Invalid comment type.");
    }
};

module.exports = {
    getCommentList: (req, res) => {
        if (req.body.commentType !== null && req.body.entityId !== null) {
            let getEntity = _verifyEntityOwnership(req.body.commentType, req.body.entityId, req.userId);

            return getEntity.then(() =>
                Comment.findAll({
                    where: {
                        ownerId: req.userId,
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
                    )
            )
                .catch(error =>
                    output.error(res, `Error getting the Comment list: ${error}`)
                );
        } else {
            output.error(res, "Please provide required comment type and entity id.");
        }
    },

    createComment: (req, res) => {
        if (req.body.commentType !== null && req.body.entityId !== null && req.body.commentContent) {
            let getEntity = _verifyEntityOwnership(req.body.commentType, req.body.entityId, req.userId);

            return getEntity.then(() =>
                Comment.create({
                    ownerId: req.userId,
                    commentType: req.body.commentType,
                    commentEntityId: req.body.entityId,
                    commentContent: req.body.commentContent
                })
                    .then(() =>
                        output.apiOutput(res, true)
                    )
            )
                .catch(error =>
                    output.error(res, `Error creating the Comment: ${error}`)
                );
        } else {
            output.error(res, "Please provide required comment type, entity id and comment content.");
        }
    },

    deleteComment: (req, res) => {
        if (req.body.commentId) {
            let getEntity = _verifyCommentOwnership(req.body.commentId, req.userId);

            return getEntity.then(() =>
                Comment.update({
                    commentDeleted: true
                }, {
                    where: {
                        commentId: req.body.commentId,
                        ownerId: req.userId
                    }
                })
                    .then(() =>
                        output.apiOutput(res, true)
                    )
            )
                .catch(error =>
                    output.error(res, `Error deleting the Comment: ${error}`)
                );
        } else {
            output.error(res, "Please provide required comment id.");
        }
    }
};
