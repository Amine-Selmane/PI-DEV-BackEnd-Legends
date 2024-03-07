const Order = require('../model/order');

// Get all orders
const getAllOrders = async (req, res) => {
    try {
      let orders;
  
      // Check if there's a filter criteria in the query params
      if (req.query.criteria) {
        const { criteria } = req.query;
  
        // Implement logic to filter orders based on the criteria
        if (criteria === 'pending' || criteria === 'processing' || criteria === 'completed') {
          orders = await Order.find({ status: criteria });
        } else {
          return res.status(400).json({ message: 'Invalid filter criteria' });
        }
      } else {
        // If no filter criteria provided, fetch all orders
        orders = await Order.find();
      }
  
      res.status(200).json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
const search= async (req, res) => {
    const { criteria, value } = req.query;
  
    try {
      let orders;
      // Implement logic to search for orders based on the criteria
      if (criteria === 'customerId') {
        orders = await Order.find({ customerId: value });
      } else if (criteria === 'totalPrice') {
        orders = await Order.find({ totalPrice: value });
      } else if (criteria === 'status') {
        orders = await Order.find({ status: value });
      } else {
        return res.status(400).json({ message: 'Invalid search criteria' });
      }
  
      res.status(200).json(orders);
    } catch (error) {
      console.error('Error searching orders:', error);
      res.status(500).json({ message: 'Internal server error' });
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
    deleteOrder,search
};
