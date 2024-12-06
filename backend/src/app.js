const express = require("express");
const userRouter = require("./routes/userRouter")
const cors = require("cors");



const app = express();

app.use(cors({
    origin:"http://localhost:3000"
}));


app.use(express.json());

//routes
app.use('/api/users', userRouter);

module.exports = app;