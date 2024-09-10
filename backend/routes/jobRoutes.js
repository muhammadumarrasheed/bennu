const express = require('express');
const { getAllJobs } = require('../controllers/jobSeekerController');
const router = express.Router();

// Route to fetch all jobs
router.get('/jobs', getAllJobs);

module.exports = router;
