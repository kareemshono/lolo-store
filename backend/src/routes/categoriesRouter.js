const express = require('express');
const router = express.Router();
const db = require('../../db/index');

router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT id, name, description, img_url, created_at
      FROM categories
      ORDER BY created_at DESC
    `;
    const result = await db.query(query);
    res.json({ categories: result.rows });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

module.exports = router;