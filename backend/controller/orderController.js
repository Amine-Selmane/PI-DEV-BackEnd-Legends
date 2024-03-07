const Order = require('../model/order');

// Get all orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new order
const createOrder = async (req, res) => {
    const order = new Order({
        customerId: req.body.customerId,
        items: req.body.items,
        totalPrice: req.body.totalPrice,
        status: req.body.status
    });

    try {
        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get an order by ID
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order == null) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update an order by ID
const updateOrder = async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete an order by ID
const deleteOrder = async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: 'Order deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllOrders,
    createOrder,
    getOrderById,
    updateOrder,
    deleteOrder
};
