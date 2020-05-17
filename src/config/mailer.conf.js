"use strict";
var nodemailer = require("nodemailer");
var config = require("../config/convict.conf");
var mailConfig = {
    service: 'hotmail',
    auth: {
        user: config.get('mailAuth').user,
        pass: config.get('mailAuth').pass
    }
};
var transporter = nodemailer.createTransport(mailConfig);
module.exports = transporter;
