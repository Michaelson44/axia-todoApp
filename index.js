const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
dotenv.config();
const taskRoute = require('./routes/task');
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const categoryRoute = require('./routes/category');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());

// endpoints
app.use(authRoute);
app.use(taskRoute);
app.use(userRoute);
app.use(categoryRoute);

// mongodb connect
mongoose.connect(process.env.mongo_url)
        .then(() => console.log("mongodb connected"))
        .catch(() => console.log("mongodb error"))

app.listen(2200, () => {
    console.log("backend connected");
})