const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const session = require('express-session');

const app = express();
const port = 3000;

// PostgreSQL connection
const pool = new Pool({
    user: 'postgres', // replace with your database user
    host: 'localhost',
    database: 'postgres', // replace with your database name
    password: 'changeme', // replace with your database password
    port: 5432,
});

// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret-key', resave: false, saveUninitialized: true }));

// Routes
app.get('/', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);

    if (result.rows.length > 0) {
        req.session.user = username;
        res.redirect('/success');
    } else {
        res.render('login', { error: 'Invalid username or password' });
    }
});

app.get('/success', (req, res) => {
    if (req.session.user) {
        res.render('success', { user: req.session.user });
    } else {
        res.redirect('/');
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});