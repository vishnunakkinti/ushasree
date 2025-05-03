// Import required modules
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();  // Load env vars from .env

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Setup database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// Connect to database
db.connect((err) => {
    if (err) {
        console.error('❌ Database Connection Failed:', err.message);
        process.exit(1);
    }
    console.log('✅ Connected to RDS database!');
});

// API: Signup
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).send('All fields are required');
    }
    const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    db.query(sql, [username, email, password], (err, result) => {
        if (err) {
            console.error('❌ Signup DB Error:', err.message);
            return res.status(500).send('Signup failed: ' + err.message);
        }
        res.send('🎉 User Registered Successfully');
    });
});

// API: Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Both username and password are required');
    }
    const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
    db.query(sql, [username, password], (err, results) => {
        if (err) {
            console.error('❌ Login DB Error:', err.message);
            return res.status(500).send('Login failed: ' + err.message);
        }
        if (results.length > 0) {
            res.send('✅ Login Successful');
        } else {
            res.status(401).send('❌ Invalid Credentials');
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Backend running on port ${PORT}`);
});
