const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: String,
  date: Date,
  beginTime: String,
  endTime: String,
  location: String,
  description: String,
  price: Number,
  nbrPlaces: Number,
  imageUrl: String,
});

// Define a method to find an event by name
eventSchema.statics.findByName = function(name) {
  return this.findOne({ name });
};

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
