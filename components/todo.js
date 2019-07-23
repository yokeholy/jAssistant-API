"use strict";

const output = require("../services/output");
const Sequelize = require("sequelize");
const sequelizeInstance = require("../database/models").database;

const {
    todoCategory: TodoCategory,
    todo: Todo,
    comment: Comment
} = require("../database/models");

let _fetchTodoList = (done, res) => {
    let categoryList = [];
    sequelizeInstance.transaction(t =>
        TodoCategory.findAll({
            attributes: ["*", [Sequelize.fn("COUNT", Sequelize.col("todo.TodoId")), "todoCount"]],
            where: {
                todoCategoryStatus: true
            },
            include: [{
                model: Todo,
                attributes: [],
                where: done
                    ? {
                        todoDeleted: false
                    }
                    : {
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
    );
};

module.exports = {
    getTodoList (req, res) {
        return _fetchTodoList(false, res);
    },

    createTodoItem (req, res) {
        // Validation
        if (req.body.itemName) {
            Todo.create({
                todoName: req.body.itemName,
                todoCategoryId: req.body.todoCategoryId || 1,
                parentTodoId: req.body.parentTodoId || null
            })
                .then(() =>
                    output.apiOutput(res, true)
                );
        } else {
            output.error(res, "Please provide the Todo Item name.");
        }
    },

    updateTodoItem (req, res) {
        if (req.body.todoId && req.body.todoName) {
            Todo.update({
                todoName: req.body.todoName,
                todoUpdatedDate: new Date()
            }, {
                where: {
                    todoId: req.body.todoId
                }
            })
                .then(() =>
                    output.apiOutput(res, true)
                );
        } else {
            output.error(res, "Please provide the Todo Item ID.");
        }
    },

    toggleTodoStatus (req, res) {
        if (req.body.todoId) {
            Todo.update({
                todoDone: Sequelize.literal("NOT todoDone"),
                todoUpdatedDate: new Date()
            }, {
                where: {
                    todoId: req.body.todoId
                }
            })
                .then(() =>
                    output.apiOutput(res, true)
                );
        } else {
            output.error(res, "Please provide the Todo Item ID.");
        }
    },

    deleteTodo (req, res) {
        if (req.body.todoId) {
            Todo.update({
                todoDeleted: true,
                todoUpdatedDate: new Date()
            },
            {
                where: {
                    todoId: req.body.todoId
                }
            })
                .then(() =>
                    output.apiOutput(res, true)
                );
        } else {
            output.error(res, "Please provide the Todo Item ID.");
        }
    },

    getDoneTodoList (req, res) {
        return _fetchTodoList(true, res);
    }
};
