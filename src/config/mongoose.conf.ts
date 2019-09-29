import config = require('../config/convict.conf');

function mongooseConfig(mongoose: any) {
    mongoose.connect(config.get('mongoURI'), { useUnifiedTopology: true, useNewUrlParser: true });
    mongoose.connection.on('error', console.error.bind(console, '<====== Mongoose error: '));
    mongoose.connection.once('open', () => {
        console.log('<===== Connected to database ====>');
    });
}

export = mongooseConfig;
