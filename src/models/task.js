"use strict";
var mongoose = require("mongoose");
var taskSchema = new mongoose.Schema({
    taskUser: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    taskName: { type: String, required: true },
    taskDesc: { type: String, required: false },
    taskDeadline: { type: Date, required: false },
    taskQuanta: { type: Number, required: false },
    taskWorkHrs: { type: Number, required: false },
    taskInitWorkHrs: { type: Number, required: false }
});
taskSchema.set('toJSON', { getters: true, virtuals: true });
module.exports = mongoose.model('task', taskSchema);
