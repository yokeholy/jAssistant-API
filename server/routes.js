const userAuthentication = require("../middlewares/userAuthentication");

const account = require("../components/account");
const todo = require("../components/todo");
const note = require("../components/note");
const routine = require("../components/routine");
const comment = require("../components/comment");
const lifestyle = require("../components/lifestyle");
const settings = require("../components/settings");

module.exports = function (server) {
    // Account
    server
        .post("/account/login", account.login)
        .post("/account/logout", userAuthentication, account.logout)
        .post("/account/signUp", account.signUp)
        .get("/account/getAccount", userAuthentication, account.getAccount)
        .post("/account/updateAccount", userAuthentication, account.updateAccount)
        .post("/account/updatePassword", userAuthentication, account.updatePassword);

    // TodoList
    server
        .get("/todo/getTodoList", userAuthentication, todo.getTodoList)
        .post("/todo/createTodoItem", userAuthentication, todo.createTodoItem)
        .post("/todo/updateTodoItem", userAuthentication, todo.updateTodoItem)
        .post("/todo/toggleTodoStatus", userAuthentication, todo.toggleTodoStatus)
        .post("/todo/deleteTodo", userAuthentication, todo.deleteTodo)
        .get("/todo/getDoneTodoList", userAuthentication, todo.getDoneTodoList);

    // Note
    server
        .get("/note/getNotes", userAuthentication, note.getNotes)
        .post("/note/createNote", userAuthentication, note.createNote)
        .post("/note/updateNote", userAuthentication, note.updateNote)
        .post("/note/archiveNote", userAuthentication, note.archiveNote)
        .get("/note/getArchivedNotes", userAuthentication, note.getArchivedNotes);

    // Routine
    server
        .get("/routine/getRoutineList", userAuthentication, routine.getRoutineList)
        .post("/routine/createRoutine", userAuthentication, routine.createRoutine)
        .post("/routine/updateRoutine", userAuthentication, routine.updateRoutine)
        .post("/routine/updateRoutineConfig", userAuthentication, routine.updateRoutineConfig)
        .post("/routine/checkInRoutine", userAuthentication, routine.checkInRoutine)
        .post("/routine/deleteRoutine", userAuthentication, routine.deleteRoutine);

    // Comment
    server
        .post("/comment/getCommentList", userAuthentication, comment.getCommentList)
        .post("/comment/createComment", userAuthentication, comment.createComment)
        .post("/comment/deleteComment", userAuthentication, comment.deleteComment);

    // Lifestyle
    server
        .get("/lifestyle/getLifestyle", userAuthentication, lifestyle.getLifestyle)
        .post("/lifestyle/upLifestyle", userAuthentication, lifestyle.upLifestyle)
        .get("/lifestyle/getLifestyleSettings", userAuthentication, lifestyle.getLifestyleSettings)
        .post("/lifestyle/saveLifestyleSetting", userAuthentication, lifestyle.saveLifestyleSetting)
        .post("/lifestyle/deleteLifestyleSetting", userAuthentication, lifestyle.deleteLifestyleSetting);

    // Settings
    server
        .get("/settings/getAllSettings", userAuthentication, settings.getAllSettings)
        .post("/settings/saveTodoCategorySetting", userAuthentication, settings.saveTodoCategorySetting)
        .post("/settings/deleteTodoCategorySetting", userAuthentication, settings.deleteTodoCategorySetting)
        .post("/settings/saveGeneralSettings", userAuthentication, settings.saveGeneralSettings);
};
