const log = require("pino")();
const output = require("../services/output");
const Sequelize = require("sequelize");
const sequelizeInstance = require("../database/models").database;

const {
    todoCategory: TodoCategory,
    todo: Todo,
    comment: Comment
} = require("../database/models");

const _verifyTodoOwnership = (todoId, userId) =>
    Todo.findAll({
        where: {
            ownerId: userId,
            todoId
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
            log.error(`User ${userId} doesn't own Todo ${todoId}: ${error}`);
            return Promise.reject(error);
        });

const _verifyTodoCategoryOwnership = (todoCategoryId, userId) =>
    TodoCategory.findAll({
        where: {
            ownerId: userId,
            todoCategoryId
        }
    })
        .then(data => {
            if (data.length) {
                return Promise.resolve();
            } else {
                return Promise.reject("You don't have permission of this TodoCategory.");
            }
        })
        .catch(error => {
            log.error(`User ${userId} doesn't own TodoCategory ${todoCategoryId}: ${error}`);
            return Promise.reject(error);
        });

const _fetchTodoList = (done, req, res) => {
    let categoryList = [];
    return sequelizeInstance.transaction(t =>
        TodoCategory.findAll({
            attributes: ["*", [Sequelize.fn("COUNT", Sequelize.col("todo.TodoId")), "todoCount"]],
            where: {
                ownerId: req.userId,
                todoCategoryStatus: true
            },
            include: [{
                model: Todo,
                attributes: [],
                where: done
                    ? {
                        ownerId: req.userId,
                        todoDeleted: false
                    }
                    : {
                        ownerId: req.userId,
                        todoDone: false,
                        todoDeleted: false
                    },
                required: false
            }],
            group: ["todoCategory.todoCategoryId"],
            transaction: t,
            raw: true
        })
            .then(categoryData => {
                categoryList = categoryData;
                return Todo.findAll({
                    attributes: ["*", [Sequelize.fn("COUNT", Sequelize.col("comment.commentId")), "commentCount"]],
                    where: {
                        ownerId: req.userId,
                        [Sequelize.Op.or]: [
                            {todoDone: false},
                            done ? {todoDone: true} : 1,
                            Sequelize.literal("DATE(todoUpdatedDate) = CURDATE()"),
                            Sequelize.literal("DATE(todoCreatedDate) = CURDATE()")
                        ],
                        todoDeleted: false
                    },
                    include: [{
                        model: Comment,
                        attributes: [],
                        where: {
                            ownerId: req.userId,
                            commentType: 1,
                            commentDeleted: 0
                        },
                        required: false
                    }],
                    group: ["todo.todoId"],
                    raw: true
                });
            })
            .then(todoData => {
                // Loop through the list to separate root todo items from sub todo items
                let rootTodos = [];
                let subTodos = [];
                for (let i = 0; i < todoData.length; i++) {
                    const todoItem = todoData[i];
                    if (todoItem.parentTodoId !== null) {
                        subTodos.push(todoItem);
                    } else {
                        todoItem.subTodos = [];
                        rootTodos.push(todoItem);
                    }
                }
                // Loop through the sub todos to put them into root todos
                for (let j = 0; j < subTodos.length; j++) {
                    const subTodoItem = subTodos[j];
                    for (let k = 0; k < rootTodos.length; k++) {
                        const rootTodoItem = rootTodos[k];
                        if (subTodoItem.parentTodoId === rootTodoItem.todoId) {
                            rootTodoItem.subTodos.push(subTodoItem);
                        }
                    }
                }
                // Insert todo items into its category list
                for (let c = 0; c < categoryList.length; c++) {
                    categoryList[c].todoList = [];
                    for (let r = 0; r < rootTodos.length; r++) {
                        if (categoryList[c].todoCategoryId === rootTodos[r].todoCategoryId) {
                            categoryList[c].todoList.push(rootTodos[r]);
                        }
                    }
                }
                return output.apiOutput(res, {
                    todoCategoryList: categoryList
                });
            })
            .catch(error =>
                output.error(res, `Error getting Todo Lists: ${error}`)
            )
    );
};

module.exports = {
    getTodoList: (req, res) => _fetchTodoList(false, req, res),

    createTodoItem: (req, res) => {
        // Validation
        if (req.body.itemName) {
            return _verifyTodoCategoryOwnership(req.body.todoCategoryId, req.userId)
                .then(() =>
                    Todo.create({
                        ownerId: req.userId,
                        todoName: req.body.itemName,
                        todoCategoryId: req.body.todoCategoryId || 1,
                        parentTodoId: req.body.parentTodoId || null
                    })
                )
                .then(() =>
                    output.apiOutput(res, true)
                )
                .catch(error =>
                    output.error(res, `Error creating Todo: ${error}`)
                );
        } else {
            return output.error(res, "Please provide the Todo Item name.");
        }
    },

    updateTodoItem: (req, res) => {
        if (req.body.todoId && req.body.todoName) {
            return _verifyTodoOwnership(req.body.todoId, req.userId)
                .then(() =>
                    Todo.update({
                        todoName: req.body.todoName,
                        todoUpdatedDate: new Date()
                    }, {
                        where: {
                            todoId: req.body.todoId
                        }
                    })
                )
                .then(() =>
                    output.apiOutput(res, true)
                )
                .catch(error =>
                    output.error(res, `Error updating Todo: ${error}`)
                );
        } else {
            return output.error(res, "Please provide the Todo Item ID.");
        }
    },

    toggleTodoStatus: (req, res) => {
        if (req.body.todoId) {
            return _verifyTodoOwnership(req.body.todoId, req.userId)
                .then(() =>
                    Todo.update({
                        todoDone: Sequelize.literal("NOT todoDone"),
                        todoUpdatedDate: new Date()
                    }, {
                        where: {
                            todoId: req.body.todoId
                        }
                    })
                )
                .then(() =>
                    output.apiOutput(res, true)
                )
                .catch(error =>
                    output.error(res, `Error mark Todo as Done: ${error}`)
                );
        } else {
            return output.error(res, "Please provide the Todo Item ID.");
        }
    },

    deleteTodo: (req, res) => {
        if (req.body.todoId) {
            return _verifyTodoOwnership(req.body.todoId, req.userId)
                .then(() =>
                    Todo.update({
                        todoDeleted: true,
                        todoUpdatedDate: new Date()
                    },
                    {
                        where: {
                            todoId: req.body.todoId
                        }
                    })
                )
                .then(() =>
                    output.apiOutput(res, true)
                )
                .catch(error =>
                    output.error(res, `Error deleting Todo: ${error}`)
                );
        } else {
            return output.error(res, "Please provide the Todo Item ID.");
        }
    },

    getDoneTodoList: (req, res) => _fetchTodoList(true, req, res)
};
