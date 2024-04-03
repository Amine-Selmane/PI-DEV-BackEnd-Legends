const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customerId: {
        type: String,
        ref: 'User', // Assuming you have a User model for customer details
        required: true
    },
    items: [
        { 
            itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' }, // Assuming you have a Product model
            quantity: { type: Number, default: 1 } 
        }
    ],
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    shipping: { type: Object, required: true },
    delivery_status: { type: String, default: "pending" },
    payment_status: { type: String, required: true },
    
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
