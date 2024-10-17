'use strict';

const express = require('express');
const path = require('path');
const fs = require('fs').promises; // Use promises version of fs

const router = express.Router();

router.get('/', async (req, res) => {
    const usersDir = path.join(__dirname, 'websites/users');

    try {
        const files = await fs.readdir(usersDir);
        console.log('Files in directory:', files); // Log files read

        const directories = await Promise.all(files.map(async (file) => {
            const filePath = path.join(usersDir, file);
            const stats = await fs.lstat(filePath);
            return stats.isDirectory() ? file : null;
        }));

        const websites = directories.filter(Boolean).map(dir => ({
            user: dir,
            url: `http://${dir}.${process.env.SUFFIX}`
        }));

        console.log('Websites JSON:', websites); // Log the generated JSON
        res.json(websites); // Respond with JSON
    } catch (err) {
        console.error('Error reading directory:', err); // Log error
        res.status(500).json({ error: 'Failed to read directory' });
    }
});


module.exports = router;
