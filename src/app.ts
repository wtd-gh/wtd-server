// Packages
import express = require('express');
import bodyParser = require('body-parser');
import mongoose = require('mongoose');

// Config
import config = require('./config/convict.conf');
import mongooseConfig = require('./config/mongoose.conf');

// Routers
import authRouter = require('./routes/auth');


const app = express();
app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set headers
app.use((req, res, next) => {
    // No need of CORS Headers in production
    if (config.get('env') !== 'production') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader(
            'Access-Control-Allow-Methods',
            'GET, POST, PUT, PATCH, DELETE'
        );
    }
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, x-auth'
    );
    res.setHeader(
        'Access-Control-Expose-Headers',
        'Content-Type, x-auth'
    );
    next();
});

// Load Configs
mongooseConfig(mongoose);

// Load routes
app.use('/auth', authRouter);

export = app;
