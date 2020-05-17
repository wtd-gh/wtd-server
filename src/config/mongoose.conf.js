"use strict";
var config = require("../config/convict.conf");
function mongooseConfig(mongoose) {
    mongoose.connect(config.get('mongoURI'), { useUnifiedTopology: true, useNewUrlParser: true });
    mongoose.connection.on('error', console.error.bind(console, '<====== Mongoose error: '));
    mongoose.connection.once('open', function () {
        console.log('<===== Connected to database ====>');
    });
}
module.exports = mongooseConfig;
