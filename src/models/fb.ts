import mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    pass: { type: String, required: true },
});

userSchema.set('toJSON', { getters: true, virtuals: true });
export = mongoose.model('user', userSchema);
