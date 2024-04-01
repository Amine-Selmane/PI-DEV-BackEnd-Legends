const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  name: String,
  nbrPlaces: Number,
  price: Number,
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
