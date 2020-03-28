import mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    regDate: { type: Date, required: true },
    tasks: [{
        taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'task' }
    }]
});

userSchema.set('toJSON', { getters: true, virtuals: true });
export = mongoose.model('user', userSchema);
