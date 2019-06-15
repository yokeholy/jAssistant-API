"use strict";

const todo = require("../components/todo");
const note = require("../components/note");
const routine = require("../components/routine");
const lifestyle = require("../components/lifestyle");

module.exports = function (server) {
    // TodoList
    server
        .get("/todo/getTodoList", todo.getTodoList)
        .post("/todo/createTodoItem", todo.createTodoItem)
        .post("/todo/updateTodoItem", todo.updateTodoItem)
        .post("/todo/toggleTodoStatus", todo.toggleTodoStatus)
        .post("/todo/deleteTodo", todo.deleteTodo);
    // Note
    server
        .get("/note/getNote", note.getNote)
        .post("/note/updateNote", note.updateNote)
        .post("/note/archiveNote", note.archiveNote);
    // Routine
    server
        .get("/routine/getRoutineList", routine.getRoutineList)
        .post("/routine/createRoutine", routine.createRoutine)
        .post("/routine/updateRoutine", routine.updateRoutine)
        .post("/routine/checkInRoutine", routine.checkInRoutine)
        .post("/routine/deleteRoutine", routine.deleteRoutine);
    // Lifestyle
    server
        .get("/lifestyle/getLifestyle", lifestyle.getLifestyle)
        .post("/lifestyle/upLifestyle", lifestyle.upLifestyle);
};
