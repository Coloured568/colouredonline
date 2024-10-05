const express = require('express');
const path = require('path');
const startDB = require('./startdb');

const router = express.Router();

router.use(async (req, res, next) => {
    const host = req.headers.host;

    // Check if the host matches the expected domain structure
    const expectedDomain = 'poyoweb.poyo.study';
    const subdomain = host.split('.')[0];

    if (host.endsWith(expectedDomain) && subdomain !== 'www') {
        res.locals.isPoyoweb = false;
        const subdomainPath = path.join(__dirname, 'websites/users/', subdomain);

        // Increment view count for the subdomain
        startDB.addView(subdomain);

        try {
            // Serve the index.html file
            res.sendFile(path.join(subdomainPath, 'index.html'));
        } catch (err) {
            try {
                // If index.html is not found, serve the 404.html file
                res.sendFile(path.join(subdomainPath, '404.html'));
            } catch (err) {
                // If neither file is found, respond with a 404 status
                res.status(404).send('Website not found');
            }
        }
    } else {
        // For other requests, continue to the next middleware
        res.locals.isPoyoweb = true;
        next();
    }
});

module.exports = router;
