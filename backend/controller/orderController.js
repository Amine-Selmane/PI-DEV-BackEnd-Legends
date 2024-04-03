const Order = require('../model/order');

// Controller to get all orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

// Controller to create a new order
const createOrder = async (req, res) => {
    try {
        const { customerId, items, subtotal, total, shipping, delivery_status, payment_status } = req.body;
        const newOrder = new Order({
            customerId,
            items,
            subtotal,
            total,
            shipping,
            delivery_status,
            payment_status
        });
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
};

// Controller to get order by ID
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        console.error('Error fetching order by ID:', error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
};

// Controller to update order by ID
const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(updatedOrder);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Failed to update order' });
    }
};

// Controller to delete order by ID
const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ error: 'Failed to delete order' });
    }
};

// Controller to get order history for a customer
const getOrderHistory = async (req, res) => {
    try {
        const customerId = req.params.customerId; // Assuming the customer ID is provided in the request params
        const orders = await Order.find({ customerId }).populate('items.itemId');
        res.json({ success: true, orders });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch order history.' });
    }
};
const filterByDeliveryStatus = async (req, res) => {
    try {
        const { deliveryStatus } = req.params;
        const orders = await Order.find({ delivery_status: deliveryStatus });
        res.json(orders);
    } catch (error) {
        console.error('Error filtering orders by delivery status:', error);
        res.status(500).json({ error: 'Failed to filter orders' });
    }
};



module.exports = { getAllOrders, createOrder, getOrderById, updateOrder, deleteOrder, getOrderHistory, filterByDeliveryStatus };
