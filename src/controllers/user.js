"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTasks = exports.decreaseWorkHrs = exports.tellTodo = exports.deleteTask = exports.addTask = void 0;
var validator = require("validator");
var User = require("../models/user");
var Task = require("../models/task");
function addTask(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, taskName, taskDesc, taskQuanta, taskWorkHrs, taskDeadline, user_1, newTask, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userId = req.userID;
                    taskName = req.body.tName;
                    taskDesc = req.body.tDesc;
                    taskQuanta = req.body.tQuanta;
                    taskWorkHrs = req.body.tWorkHrs;
                    taskDeadline = req.body.tDeadline;
                    if (!taskName || !taskQuanta || !taskWorkHrs || !taskDeadline) {
                        res.status(200).json({ ok: false, error: 'At least one required field is either not valid or is empty!' });
                        return [2 /*return*/];
                    }
                    if (taskName.length + taskDesc.length > 10000) {
                        res.status(200).json({ ok: false, error: 'Too much to store!' });
                        return [2 /*return*/];
                    }
                    if (!validator.isAfter(taskDeadline)) {
                        res.status(200).json({ ok: false, error: 'Task deadline cannot be in past!' });
                        return [2 /*return*/];
                    }
                    taskDeadline = validator.toDate(taskDeadline);
                    return [4 /*yield*/, User.findById(userId)];
                case 1:
                    user_1 = _a.sent();
                    taskName = validator.escape(taskName);
                    taskDesc = validator.escape(taskDesc);
                    newTask = {
                        taskUser: userId,
                        taskName: taskName,
                        taskDesc: taskDesc,
                        taskQuanta: taskQuanta,
                        taskDeadline: taskDeadline,
                        taskWorkHrs: taskWorkHrs,
                        taskInitWorkHrs: taskWorkHrs
                    };
                    new Task(newTask).save().then(function (task) {
                        user_1.tasks.push({ taskId: task._id });
                        user_1.save().then(function (savedUser) {
                            res.status(200).json({ ok: true, task: task });
                            return;
                        });
                    });
                    return [2 /*return*/];
                case 2:
                    error_1 = _a.sent();
                    console.log(error_1);
                    res.status(500).json({ error: 'Internal error!' });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.addTask = addTask;
function deleteTask(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, tId, user, userTasks, i, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 9, , 10]);
                    userId = req.userID;
                    tId = req.body.tId;
                    if (!tId) {
                        res.status(403).json({ error: 'Can\'t delete task!' });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, User.findById(userId)];
                case 1:
                    user = _a.sent();
                    return [4 /*yield*/, user.tasks];
                case 2:
                    userTasks = _a.sent();
                    i = 0;
                    _a.label = 3;
                case 3:
                    if (!(i < userTasks.length)) return [3 /*break*/, 6];
                    if (!(String(userTasks[i].taskId) === tId)) return [3 /*break*/, 5];
                    return [4 /*yield*/, userTasks.splice(i, 1)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    i++;
                    return [3 /*break*/, 3];
                case 6: return [4 /*yield*/, user.save()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, Task.findByIdAndDelete(String(tId), function (err) { console.log(err); })];
                case 8:
                    _a.sent();
                    res.status(200).json({ ok: true });
                    return [2 /*return*/];
                case 9:
                    error_2 = _a.sent();
                    console.log(error_2);
                    res.status(500).json({ error: 'Internal error!' });
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
exports.deleteTask = deleteTask;
function compareTasks(t1, t2) {
    var currDate = new Date().getTime() / 3600000;
    var t1Date = new Date(t1.taskDeadline).getTime() / 3600000;
    var t2Date = new Date(t2.taskDeadline).getTime() / 3600000;
    var t1WHrPD = t1.taskWorkHrs / (t1Date - currDate);
    var t2WHrPD = t2.taskWorkHrs / (t2Date - currDate);
    if (t1WHrPD > t2WHrPD) {
        return -1;
    }
    else {
        return 1;
    }
}
function tellTodo(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, mins, user, userTaskList, userTasks, i, t, sTask, i, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    userId = req.userID;
                    mins = req.body.mins;
                    if (!mins) {
                        res.status(200).json({ ok: false, error: 'Can\'t anything in zero minutes!' });
                        return [2 /*return*/];
                    }
                    if (mins <= 0) {
                        res.status(200).json({ ok: false, error: 'Can\'t go in the past!' });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, User.findById(userId)];
                case 1:
                    user = _a.sent();
                    return [4 /*yield*/, user.tasks];
                case 2:
                    userTaskList = _a.sent();
                    userTasks = [];
                    i = 0;
                    _a.label = 3;
                case 3:
                    if (!(i < userTaskList.length)) return [3 /*break*/, 6];
                    return [4 /*yield*/, Task.findById(userTaskList[i].taskId)];
                case 4:
                    t = _a.sent();
                    userTasks.push(t);
                    _a.label = 5;
                case 5:
                    i++;
                    return [3 /*break*/, 3];
                case 6:
                    userTasks.sort(compareTasks);
                    sTask = null;
                    for (i = 0; i < userTasks.length; i++) {
                        if (userTasks[i].taskQuanta <= (mins / 60)) {
                            sTask = userTasks[i];
                            break;
                        }
                    }
                    if (sTask == null) {
                        res.status(200).json({ ok: false, error: 'No task with a shorter quanta, maybe you should add some!' });
                    }
                    else {
                        res.status(200).json({ ok: false, task: sTask });
                    }
                    return [2 /*return*/];
                case 7:
                    error_3 = _a.sent();
                    console.log(error_3);
                    res.status(500).json({ error: 'Internal error!' });
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.tellTodo = tellTodo;
function decreaseWorkHrs(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, taskId, decAmount, task, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userId = req.userID;
                    taskId = req.body.tId;
                    decAmount = req.body.decAmount;
                    if (!taskId || !decAmount) {
                        res.status(200).json({ ok: false, error: 'At least one required field is either not valid or is empty!' });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, Task.findById(taskId)];
                case 1:
                    task = _a.sent();
                    if (!task || String(task.taskUser) !== userId) {
                        res.status(200).json({ ok: false, error: 'Task Id is not valid!' });
                        return [2 /*return*/];
                    }
                    task.taskWorkHrs -= decAmount;
                    if (task.taskWorkHrs < 0) {
                        task.taskWorkHrs = 0;
                    }
                    task.save().then(function (t) {
                        res.status(200).json({ ok: true });
                        return;
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    console.log(error_4);
                    res.status(500).json({ error: 'Internal error!' });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.decreaseWorkHrs = decreaseWorkHrs;
function getAllTasks(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, user, tasks, userTaskList, userTasks, i, t, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    userId = req.userID;
                    return [4 /*yield*/, User.findById(userId)];
                case 1:
                    user = _a.sent();
                    tasks = [];
                    return [4 /*yield*/, user.tasks];
                case 2:
                    userTaskList = _a.sent();
                    userTasks = [];
                    i = 0;
                    _a.label = 3;
                case 3:
                    if (!(i < userTaskList.length)) return [3 /*break*/, 6];
                    return [4 /*yield*/, Task.findById(userTaskList[i].taskId)];
                case 4:
                    t = _a.sent();
                    userTasks.push(t);
                    _a.label = 5;
                case 5:
                    i++;
                    return [3 /*break*/, 3];
                case 6:
                    userTasks.sort(compareTasks);
                    res.status(200).json({
                        count: userTasks.length,
                        tasks: userTasks
                    });
                    return [3 /*break*/, 8];
                case 7:
                    error_5 = _a.sent();
                    console.log(error_5);
                    res.status(500).json({ error: 'Internal error!' });
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.getAllTasks = getAllTasks;
