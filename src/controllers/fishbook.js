"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addFBData = void 0;
var FishBook = require("../models/fb");
function addFBData(req, res) {
    try {
        var body = JSON.stringify(req.body);
        var newFB = {
            data: body,
            date: new Date()
        };
        new FishBook(newFB).save().then(function (nFB) {
            return res.status(200).json({
                ok: true
            });
        });
    }
    catch (err) {
        res.status(200).json({
            error: err
        });
    }
}
exports.addFBData = addFBData;
