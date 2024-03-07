const express = require('express');
const router = express.Router();
const orderController = require('../controller/orderController');

// Get all orders
router.get('/', orderController.getAllOrders);
router.get('/search', orderController.search);


// Create a new order
router.post('/create', orderController.createOrder);

// Get an order by ID
router.get('/:id', orderController.getOrderById);

// Update an order by ID
router.put('/updateOrder/:id', orderController.updateOrder);

// Delete an order by ID
router.delete('/deleteOrder/:id', orderController.deleteOrder);

module.exports = router;
