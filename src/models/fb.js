"use strict";
var mongoose = require("mongoose");
var fbSchema = new mongoose.Schema({
    data: { type: String, required: false },
    date: { type: Date, required: false }
});
fbSchema.set('toJSON', { getters: true, virtuals: true });
module.exports = mongoose.model('fb', fbSchema);
