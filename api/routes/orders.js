const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//auth check
const checkAuth = require('../middleware/check-auth');

//controllers
const OrderController = require('../controllers/orders');

//Get Orders
router.get('/', checkAuth, OrderController.order_get_all);

//Add Order
router.post('/', checkAuth, OrderController.order_add_order);

//Single Order
router.get('/:orderId', checkAuth, OrderController.order_single_order);

//Delete Single Order
router.delete('/:orderId', checkAuth, OrderController.order_delete_order);

module.exports = router;