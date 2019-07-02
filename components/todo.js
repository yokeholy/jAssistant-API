"use strict";

const output = require("../services/output");
const Sequelize = require("sequelize");

const {todo: Todo} = require("../models");

module.exports = {
    getTodoList (req, res) {
        Todo.findAll({
            where: {
                [Sequelize.Op.or]: [
                    {todoStatus: false},
                    Sequelize.literal("DATE(todoUpdatedDate) = CURDATE()"),
                    Sequelize.literal("DATE(todoCreatedDate) = CURDATE()")
                ]
            },
            raw: true
        }).then(data => {
            // Loop through the list to separate root todo items from sub todo items
            let rootTodos = [];
            let subTodos = [];
            for (let i = 0; i < data.length; i++) {
                const todoItem = data[i];
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
            return output.apiOutput(res, {todoList: rootTodos});
        });
    },
    createTodoItem (req, res) {
        // Validation
        if (req.body.itemName) {
            Todo.create({
                todoName: req.body.itemName,
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
                todoName: req.body.todoName
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
                todoStatus: Sequelize.literal("NOT todoStatus"),
                todoUpdatedDate: Sequelize.literal("CURRENT_TIMESTAMP")
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
            Todo.destroy({
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
    }
};
