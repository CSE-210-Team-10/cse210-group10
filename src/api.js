// Import required modules
import express from 'express';
import { getIssues, getPullRequests } from './githubAPI.js';

// const express = require('express');
// const { getIssues } = require('./githubAPI');

// Initialize the Express app
const app = express();

app.use(express.json());

app.get('/hello', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

app.get('/issues', async (req, res) => {
    try {
        const issues = await getIssues(); 
        if (issues.error) {
            return res.status(429).json({ error: issues.error });
        }
        res.json(issues);
    } catch (error) {
        // Catch and handle any errors
        console.error('Error fetching issues:', error);
        res.status(500).json({ error: 'Failed to fetch issues' });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
