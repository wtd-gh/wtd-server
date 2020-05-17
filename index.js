#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app = require("./src/app");
var http = require("http");
var port = process.env.PORT || 5000;
app.set('port', port);
var server = http.createServer(app);
server.listen(port);
