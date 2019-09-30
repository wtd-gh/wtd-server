import mongoose = require('mongoose');

const reptaskSchema = new mongoose.Schema({
    taskUser: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    taskName: { type: String, required: true },
    taskDesc: { type: String, required: false },
    taskQuanta: { type: Number, required: false },
    taskWorkHrs: { type: Number, required: false },
    taskRepDays: { type: [Number], required: false },
    taskRepTime: { type: Number, required: false }, // Time in minutes from 00:00
    taskLastGenDL: { type: Date, required: false, default: null } // Deadline of last generated task from this repeatative task
});

reptaskSchema.set('toJSON', { getters: true, virtuals: true });
export = mongoose.model('repeatTask', reptaskSchema);
