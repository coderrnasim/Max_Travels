const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const seedSuperAdmin = require('./config/seedAdmin'); // seedAdmin ইমপোর্ট

// ডাটাবেজ কানেক্ট করা এবং এডমিন ইউজার সিড করা
connectDB().then(() => {
    seedSuperAdmin(); // ডাটাবেজ রেডি হলে এডমিন অ্যাকাউন্ট চেক/তৈরি করবে
});

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes Connector
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Max Travels SaaS Backend is Running Live...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});