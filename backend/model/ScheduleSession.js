const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  startDateTime: {
    type: String,
    required: true
  },
  endDateTime: {
    type: String,
    required: true
  },
  day: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('ScheduleSession', scheduleSchema);