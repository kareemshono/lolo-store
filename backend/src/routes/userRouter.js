const express = require('express');
const router = express.Router();
const queries = require('../../db/queries');

// Add a new user
router.post('/', async (req, res) => {
    const { name, email, password, phone, is_admin, created_at } = req.body;
    try {
        const user = await queries.addUser({ name, email, password, phone, is_admin, created_at });
        res.status(201).json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await queries.getAllUsers();
        res.status(200).json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get a specific user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await queries.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update a user
router.put('/:id', async (req, res) => {
    const { name, email, phone } = req.body;
    try {
        const user = await queries.updateUser(req.params.id, { name, email, phone });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete a user
router.delete('/:id', async (req, res) => {
    try {
        const user = await queries.deleteUser(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
