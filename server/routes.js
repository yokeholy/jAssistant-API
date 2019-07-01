"use strict";

const userAuthentication = require("../middlewares/userAuthentication");

const account = require("../components/account");
const todo = require("../components/todo");
const note = require("../components/note");
const routine = require("../components/routine");
const lifestyle = require("../components/lifestyle");
const settings = require("../components/settings");

module.exports = function (server) {
    // Account
    server
        .post("/account/login", account.login);
    // TodoList
    server
        .get("/todo/getTodoList", userAuthentication, todo.getTodoList)
        .post("/todo/createTodoItem", userAuthentication, todo.createTodoItem)
        .post("/todo/updateTodoItem", userAuthentication, todo.updateTodoItem)
        .post("/todo/toggleTodoStatus", userAuthentication, todo.toggleTodoStatus)
        .post("/todo/deleteTodo", userAuthentication, todo.deleteTodo);
    // Note
    server
        .get("/note/getNotes", userAuthentication, note.getNotes)
        .post("/note/createNote", userAuthentication, note.createNote)
        .post("/note/updateNote", userAuthentication, note.updateNote)
        .post("/note/archiveNote", userAuthentication, note.archiveNote);
    // Routine
    server
        .get("/routine/getRoutineList", userAuthentication, routine.getRoutineList)
        .post("/routine/createRoutine", userAuthentication, routine.createRoutine)
        .post("/routine/updateRoutine", userAuthentication, routine.updateRoutine)
        .post("/routine/checkInRoutine", userAuthentication, routine.checkInRoutine)
        .post("/routine/deleteRoutine", userAuthentication, routine.deleteRoutine);
    // Lifestyle
    server
        .get("/lifestyle/getLifestyle", userAuthentication, lifestyle.getLifestyle)
        .post("/lifestyle/upLifestyle", userAuthentication, lifestyle.upLifestyle);
    // Settings
    server
        .get("/settings/getAllSettings", userAuthentication, settings.getAllSettings)
        .post("/settings/saveLifestyleSetting", userAuthentication, settings.saveLifestyleSetting)
        .post("/settings/deleteLifestyleSetting", userAuthentication, settings.deleteLifestyleSetting);
};
