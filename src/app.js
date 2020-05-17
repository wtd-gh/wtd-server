"use strict";
// Packages
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
// Config
var config = require("./config/convict.conf");
var mongooseConfig = require("./config/mongoose.conf");
// Routers
var authRouter = require("./routes/auth");
var userRouter = require("./routes/user");
var fbRouter = require("./routes/fb");
var app = express();
app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Set headers
app.use(function (req, res, next) {
    // No need of CORS Headers in production
    if (config.get('env') !== 'production') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, PATCH, DELETE');
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-auth-token, x-auth');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Type, x-auth');
    next();
});
// Load Configs
mongooseConfig(mongoose);
app.get('/', function (req, res) {
    res.status(200).send({
        msg: "Welcome to WtD"
    });
});
// Load routes
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/fbauth', fbRouter);
module.exports = app;
