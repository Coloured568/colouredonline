const express = require('express');
const startDB = require('./startdb');
const authRouter = require('./auth');
const authToken = require('./middleware/auth');
const authVerifier = require('./middleware/authenticated');
require('dotenv').config();
var cookieParser = require('cookie-parser')

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
app.use(authVerifier);


// Routes
async function authenticated(req) {
    return req.cookies['x-session-token'] ? true : false;
}
app.get('/', async (req, res) => {
    res.render('index', { title: 'Home', url: process.env.URL});
});

app.use('/auth', authRouter);

app.get('/dashboard', authToken, (req, res) => {
    res.render('dashboard', { title: 'Dashboard', url: process.env.URL });
});

// 404 Error Handler
app.use((req, res, next) => {
    res.status(404).send('404 Not Found, Silly!');
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});