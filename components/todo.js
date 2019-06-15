"use strict";

const output = require("../services/output");
const log = require("pino")();
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
        }).then(function (data) {
            output.apiOutput(res, {todoList: data});
        });
    },
    createTodoItem (req, res) {
        // Validation
        if (req.body.itemName) {
            Todo.create({
                todoName: req.body.itemName
            });
            output.apiOutput(res, true);
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
            });
            output.apiOutput(res, true);
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
            });
            output.apiOutput(res, true);
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
            });
            output.apiOutput(res, true);
        } else {
            output.error(res, "Please provide the Todo Item ID.");
        }
    }
};
