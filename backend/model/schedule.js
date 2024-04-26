const mongoose = require ('mongoose');

const scheduleSchema = new mongoose.Schema({
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    student:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    day: {
        type: String,
    },
    startTime: {
        type: String,
    },
    endTime: {
        type: String,
    },
    classroom: {
        type: Number,
        required: false
    },
    class : {
        type: String
    }
})

module.exports = mongoose.model('Schedule', scheduleSchema)