const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize');

const User = require('../models/user');
const Order = require('../models/order');

// - Create a new user.
router.post('/', async (req, res) => {
  try {
    const { username, email } = req.body;
    const newUser = await User.create({ username, email });
    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

// - Retrieve a list of all users with their associated orders.
router.get('/', async (req, res) => {
  try {
    const usersWithOrders = await User.findAll({ include: Order });
    res.status(200).json(usersWithOrders);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

// - Retrieve a single user by their ID along with their orders.
router.get('/:id', async (req, res) => {
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

// - Update a user's information (username or email) by their ID.
router.put(':/id', async (req, res) => {
  const userId = req.params.id;
  try {
    const { username, email } = req.body;
    const [updatedRows] = await User.update(
      { username, email },
      { where: { id: userId } }
    );

    if (updatedRows === 0) {
      return res.status(404).send('User not found');
    }
    res.status(200).send('User updated successfully.');
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

// - Delete a user by their ID.
router.delete('/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const deletedRows = await User.destroy({ where: { id: userId } });

    if (deletedRows === 0) {
      return res.status(404).send('User not found');
    }
    res.status(200).send('User deleted successfully.');
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

// Implement a route to retrieve a list of users who have made orders, along with the total number
// of orders each user has made. Use Sequelize to perform a SQL join between the Users and
// Orders tables to achieve this.
router.get('/users-with-orders', async (req, res) => {
  try {
    const usersWithOrderCount = await User.findAll({
      include: [
        {
          model: Order,
          attributes: [],
        },
      ],
      attributes: {
        include: [
          Sequelize.fn('COUNT', Sequelize.col('Orders.id')),
          'orderCount',
        ],
      },
      group: ['User.id'],
    });

    res.status(200).json(usersWithOrderCount);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
