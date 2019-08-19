const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');


// Import Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');


dotenv.config();  

// connect to DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () =>
    console.log('Connected to the Database!')
);

// Middleware
app.use(express.json());

// Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(5775, () => console.log('Server start running'));
