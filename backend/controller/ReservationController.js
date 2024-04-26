const asyncHandler = require('express-async-handler');
const {Reservation} = require('../model/reservation'); // Update the model import


const reservationController = {
  createReservation: asyncHandler(async (req, res) => {
    try {
      const reservation = new Reservation(req.body);
      await reservation.save();
      res.status(201).json(reservation);
    } catch (error) {
      console.error(error); // Log the error
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }),

  getAllReservations: asyncHandler(async (req, res) => {
    const reservations = await Reservation.find();
    res.json(reservations);
  }),

  getReservationById: asyncHandler(async (req, res) => {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json(reservation);
  }),

  updateReservationById: asyncHandler(async (req, res) => {
    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedReservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json(updatedReservation);
  }),

  deleteReservationById: asyncHandler(async (req, res) => {
    const deletedReservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!deletedReservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json({ message: 'Reservation deleted successfully' });
  }),
};

module.exports = reservationController;
