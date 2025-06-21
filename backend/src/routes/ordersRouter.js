const express = require('express');
const router = express.Router();
const db = require('../../db/index');

router.post('/', async (req, res) => {
    const { user_id, address_id, total, order_items } = req.body;
    try {
        await db.query('BEGIN');
        const orderResult = await db.query(
            'INSERT INTO orders (user_id, address_id, total) VALUES ($1, $2, $3) RETURNING *',
            [user_id, address_id, total]
        );
        const order = orderResult.rows[0];
        for (const item of order_items) {
            await db.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
                [order.id, item.product_id, item.quantity, item.price]
            );
        }
        await db.query('COMMIT');
        res.status(201).json(order);
    } catch (error) {
        await db.query('ROLLBACK');
        console.error('Order creation error:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const orders = await db.query(
            'SELECT o.*, a.* FROM orders o JOIN addresses a ON o.address_id = a.id WHERE o.user_id = $1',
            [userId]
        );
        const orderItems = await db.query(
            'SELECT oi.* FROM order_items oi JOIN orders o ON oi.order_id = o.id WHERE o.user_id = $1',
            [userId]
        );
        res.json(orders.rows.map(order => ({
            ...order,
            orderItems: orderItems.rows.filter(oi => oi.order_id === order.id)
        })));
    } catch (error) {
        console.error('Fetch orders error:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

router.get('/all', async (req, res) => {
    try {
        const orders = await db.query(
            'SELECT o.*, u.email, a.* FROM orders o JOIN site_user u ON o.user_id = u.id JOIN addresses a ON o.address_id = a.id'
        );
        const orderItems = await db.query('SELECT * FROM order_items');
        res.json(orders.rows.map(order => ({
            ...order,
            orderItems: orderItems.rows.filter(oi => oi.order_id === order.id)
        })));
    } catch (error) {
        console.error('Fetch all orders error:', error);
        res.status(500).json({ error: 'Failed to fetch all orders' });
    }
});

module.exports = router;