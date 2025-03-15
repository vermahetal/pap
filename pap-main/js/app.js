const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors'); // NEW: CORS middleware

const app = express();
const db = new sqlite3.Database('./users.db'); // Path to your database

// Middleware to parse JSON bodies
app.use(cors());  // NEW: Allow cross-origin requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create table if it doesn't exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        password TEXT,
        email TEXT
    )`);
});

// Register Route
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    db.run(query, [username, email, password], function(err) {
        if (err) {
            return res.status(500).send({ message: 'Error saving user data.' });
        }
        res.redirect('http://127.0.0.1:5500/login.html'); // Redirect to login page
    });
});

// Login Route
app.post('/login', (req, res) => {
    const { email, password } = req.body; // Remove `username`

    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';

    db.get(query, [email, password], (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal server error');
        }

        if (row) {
            res.redirect('http://127.0.0.1:5500/index.html');  // Redirect if login is successful
        } else {
            res.status(401).send('Invalid email or password');
        }
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
