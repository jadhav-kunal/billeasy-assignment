const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Order = require('../models/order');

// - Create a new order for a specific user.
router.post('/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const { totalAmount } = req.body;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    const newOrder = await Order.create({ totalAmount, userId });
    res.status(201).json(newOrder);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

// - Retrieve all orders for a specific user.
router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const userWithOrders = await User.findByPk(userId, { include: Order });

    if (!userWithOrders) {
      return res.status(404).send('User not found');
    }

    res.status(200).json(userWithOrders);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

// - Retrieve a single order by its ID.
router.get('/order/:orderId', async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).send('Order not found');
    }

    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

// - Update an order's total amount by its ID.
router.put(':/orderId', async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const { totalAmount } = req.body;
    const [updatedRows] = await Order.update(
      { totalAmount },
      { where: { id: orderId } }
    );

    if (updatedRows === 0) {
      return res.status(404).send('Order not found');
    }
    res.status(200).send('Order updated successfully.');
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

// - Delete an order by its ID
router.delete('/:orderId', async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const deletedRows = await Order.destroy({ where: { id: orderId } });

    if (deletedRows === 0) {
      return res.status(404).send('User not found');
    }
    res.status(200).send('Order deleted successfully.');
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

//  Create a route to retrieve the total revenue generated from all orders. Note - Use Sequelize to
//  perform a SQL aggregation function (SUM) to calculate the total revenue.
router.get('/total-revenue', async (req, res) => {
  try {
    const totalRevenue = await Order.sum('totalAmount');

    res.status(200).json({ totalRevenue });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
