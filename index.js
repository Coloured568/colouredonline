'use strict';

const express = require('express');
const path = require('path');
const fs = require('fs');
const startDB = require('./startdb');
const authRouter = require('./auth');
const editorRouter = require('./editor');
const authToken = require('./middleware/auth');
const redirectIfNotVerified = require('./middleware/verified');
const authUser = require('./middleware/authUser');
const authVerifier = require('./middleware/authenticated');
const subdomainHandler = require('./domains');
const discoverRoute = require('./discover');
require('dotenv').config();
const cookieParser = require('cookie-parser');

db = startDB.db;
startDB.setupDB();

const app = express();

app.use(express.static('public'));
app.engine('art', require('express-art-template'));
app.set("views", "./views");
app.set('view engine', 'art');
app.set('view options', {
    debug: process.env.NODE_ENV !== 'production',
    ignore: ['Math', 'Date', 'JSON', 'encodeURIComponent'],
    minimize: false
});
app.use(cookieParser());
app.use(subdomainHandler);
app.use(authVerifier);
app.use(authUser);

app.get('/', async (req, res) => {
    res.render('index', { title: 'Home', url: process.env.URL });
});
app.get('/tos', async (req, res) => {
    res.render('tos', { title: 'Terms of Service', url: process.env.URL });
}); 

/* app.use('/discover', discoverRoute); */-

app.get('/discover', async (req, res) => {
    res.render('discover', { title: 'Discovery', url: process.env.URL })
});

app.get('/privacy', async (req, res) => {
    res.render('privacy', { title: 'Privacy Policy', url: process.env.URL });
});
app.use('/auth', authRouter);
app.use('/editor', authToken, redirectIfNotVerified, editorRouter);
app.get('/verified', (req, res) => {
    res.render('verified', { title: 'Verified', url: process.env.URL });
});
app.use('/dashboard', authToken, redirectIfNotVerified, require('./dashboard'));

// 404 Error Handler
app.use((req, res) => {
    res.status(404).send('404 Not Found, Silly!');
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
