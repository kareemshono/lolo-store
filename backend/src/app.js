const express = require("express");
const userRouter = require("./routes/userRouter");
const productsRouter = require("./routes/productsRouter");
const addressesRouter = require("./routes/addressesRouter");
const ordersRouter = require("./routes/ordersRouter");
const paymentRouter = require("./routes/paymentRouter");
const categoriesRouter = require("./routes/categoriesRouter");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

// Security headers
app.use(helmet());

// Rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per IP
    message: "Too many requests, please try again later.",
  })
);

// CORS middleware
const allowedOrigins = ["http://localhost:3000", "https://nsfashionbrand.com"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/users", userRouter);
app.use("/api/products", productsRouter);
app.use("/api/addresses", addressesRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/categories", categoriesRouter);

module.exports = app;