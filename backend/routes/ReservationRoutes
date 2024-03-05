const express = require('express');
const router = express.Router();
const reservationController = require('../controller/ReservationController'); 

router.post('/reservations/add', reservationController.createReservation); 
router.get('/reservations', reservationController.getAllReservations); 
router.get('/reservations/:id', reservationController.getReservationById); 
router.put('/reservations/update/:id', reservationController.updateReservationById);
router.delete('/reservations/delete/:id', reservationController.deleteReservationById); 

module.exports = router;
