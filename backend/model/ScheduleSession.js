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
    type: Date,
  },
  endDateTime: {
    type: Date,
  },
  // classroom: {
  //     type: Number,
  //     required: false
  // },
  // class : {
  //     type: String
  // }
});

module.exports = mongoose.model('ScheduleSession', scheduleSchema);