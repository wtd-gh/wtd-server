import nodemailer = require('nodemailer');
import config = require('../config/convict.conf');

const mailConfig = {
    service: 'hotmail',
    auth: {
        user: config.get('mailAuth').user,
        pass: config.get('mailAuth').pass
    }
};

const transporter = nodemailer.createTransport(mailConfig);

export = transporter;
