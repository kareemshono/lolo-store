const express = require("express");
const userRouter = require("./routes/userRouter")
const productsRouter = require("./routes/productsRouter")
const cookieParser = require("cookie-parser");
const cors = require("cors");



const app = express();

// CORS middleware
app.use(
    cors({
        origin: "http://localhost:3000", // Frontend origin
        credentials: true, // Allow cookies and credentials
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
        allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    })
);
app.use(express.json());
app.use(cookieParser());
//routes
app.use('/api/users', userRouter);
app.use('/api/products',productsRouter)

module.exports = app;