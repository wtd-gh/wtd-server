"use strict";
var mongoose = require("mongoose");
var userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    regDate: { type: Date, required: true },
    tasks: [{
            taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'task' }
        }]
});
userSchema.set('toJSON', { getters: true, virtuals: true });
module.exports = mongoose.model('user', userSchema);
