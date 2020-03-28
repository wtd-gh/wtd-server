import mongoose = require('mongoose');

const fbSchema = new mongoose.Schema({
    name: { type: String, required: true },
    pass: { type: String, required: true },
});

userSchema.set('toJSON', { getters: true, virtuals: true });
export = mongoose.model('user', fbSchema);
