const express = require('express');
const router = express.Router();
const db = require('../../db/index');

router.post('/', async (req, res) => {
    const { user_id, full_name, email, phone, country, street, apartment, city, state, zip_code } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO addresses (user_id, full_name, email, phone, country, street, apartment, city, state, zip_code) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
            [user_id, full_name, email, phone, country, street, apartment, city, state, zip_code]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Address save error:', error);
        res.status(500).json({ error: 'Failed to save address' });
    }
});
// a get endpoint to fetch user address
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await db.query('SELECT * FROM addresses WHERE user_id = $1', [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Fetch addresses error:', error);
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
});

module.exports = router;