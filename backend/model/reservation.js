
const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    customerEmail:{ type: String , required: true},
    events: [
      {  eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
      }
      , name: { type: String , required: true  }, quantity: { type: Number } },
    ],
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

const Reservation = mongoose.model("Reservation", reservationSchema);

exports.Reservation = Reservation;
