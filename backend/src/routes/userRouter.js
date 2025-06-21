const express = require('express');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { hashPassword, userExists } = require("../utils/authHelpers");
const router = express.Router();
const queries = require('../../db/queries');

const JWT_SECRET = process.env.JWT_SECRET;

// Add a new user
router.post('/register', async (req, res) => {
    const { name, email, password, phone, is_admin, role } = req.body;
    try {
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ msg: "All fields are required" });
        }
        if (await userExists(email)) {
            return res.status(400).json({ msg: "User already exists" });
        }
        const hashedPassword = await hashPassword(password);
        const created_at = new Date().toISOString();
        const is_admin = false;

        const user = await queries.addUser({ name, email, hashedPassword, role, phone, is_admin, created_at });
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }
        const token = jwt.sign({ id: user.id, role: role === "super_admin" ? "super_admin" : "user" }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(201).json({ msg: "User created successfully", user });
    } catch (err) {
        console.error("Signup Error:", err.message);
        res.status(500).json({ msg: "Internal server error" });
    }
});

// Login user
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ msg: "Email and password are required" });
        }
        const user = await queries.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ msg: "Invalid email or password" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ msg: "Invalid email or password" });
        }
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            msg: "Login successful",
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });
    } catch (err) {
        console.error("Login Error:", err.message, err.stack);
        res.status(500).json({ msg: "Internal server error" });
    }
});

// Logout
router.post("/logout", (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        expires: new Date(0),
    });
    res.status(200).json({ msg: "Logged out successfully" });
});

// Get current user
router.get("/me", async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ msg: "Not authenticated" });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await queries.getUserById(decoded.id);
        if (!user) {
            // Clear invalid token cookie
            res.cookie("token", "", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Strict",
                expires: new Date(0),
            });
            return res.status(401).json({ msg: "Not authenticated" });
        }
        res.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error("Me endpoint error:", err.message);
        // Clear invalid or expired token cookie
        res.cookie("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            expires: new Date(0),
        });
        res.status(401).json({ msg: "Not authenticated" });
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