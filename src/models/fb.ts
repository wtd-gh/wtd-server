import mongoose = require('mongoose');

const fbSchema = new mongoose.Schema({
    data: { type: String, required: false },
    date: { type: String, required: true }
});

fbSchema.set('toJSON', { getters: true, virtuals: true });
export = mongoose.model('fb', fbSchema);
