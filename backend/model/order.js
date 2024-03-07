const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model for customer details
        required: true
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book', // Assuming you have a Book model for the items
        required: true
    }],
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed'],
        default: 'pending'
    }
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;