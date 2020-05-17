"use strict";
var express = require("express");
var req_1 = require("../helpers/req");
var req_2 = require("../helpers/req");
var fishbook_1 = require("../controllers/fishbook");
var router = express.Router();
router.route('/auth').post(req_1.handleDError, fishbook_1.addFBData, req_2.handleServerError);
module.exports = router;
