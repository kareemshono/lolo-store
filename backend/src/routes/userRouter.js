const express = require('express');
const jwt = require("jsonwebtoken");
const { hashPassword, userExists } = require("../utils/authHelpers");
const router = express.Router();
const queries = require('../../db/queries');

// 🔹 Load JWT secret from .env
const JWT_SECRET = process.env.JWT_SECRET;


// Add a new user
router.post('/register', async (req, res) => {
    const { name, email, password, phone, is_admin,role } = req.body;
    try {
        // Validate input
    if (!name || !email || !password || !phone ) {
        return res.status(400).json({ msg: "All fields are required" });
      }
      // Check if user exists
    if (await userExists(email)) {
        return res.status(400).json({ msg: "User already exists" });
      }
 // Hash password
 const hashedPassword = await hashPassword(password);
 console.log(hashedPassword)
 // Set created_at as the current timestamp with timezone
 const created_at = new Date().toISOString();
 const is_admin = "user"
        const user = await queries.addUser({ name, email, hashedPassword ,role, phone, is_admin, created_at });
          // Generate JWT Token
          if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }
    const token = jwt.sign({ id: user.id, role: role === "super_admin" ? "super_admin " :"user" }, process.env.JWT_SECRET, { expiresIn: "7d" });
 // Store token in HTTP-only cookie
 res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Only secure in production
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});
         res.status(201).json({ msg: "User created successfully", user, token });
    } catch (err) {
        console.error("Signup Error:", err.message);
        //delete err:err.message from beign sent to response as it can leak db errors
        res.status(500).json({ msg: "Internal server error",err:err.message });
    }
});

// login user
router.post("/login", async (req,res) => {
    const {email,password} = req.body;

    try {
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ msg: "Email and password are required" });
        }

        // Check if user exists
        const user = await queries.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ msg: "Invalid credentials" });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ msg: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

        // Store token in HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({ msg: "Login successful", user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ msg: "Internal server error" });
    }

})

// logout
router.post("/logout", (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        expires: new Date(0), // Expire immediately
    });
    res.status(200).json({ msg: "Logged out successfully" });
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
