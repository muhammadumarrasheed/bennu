const JobPosting = require('../models/jobPostingModel');
const ScrapedJob = require('../models/ScrapedJob');

// Get all jobs (manual and scraped)
exports.getAllJobs = async (req, res) => {
  try {
    // Fetch jobs from both collections
    const manualJobs = await JobPosting.find({ status: 'open' });
    const scrapedJobs = await ScrapedJob.find({});

    // Combine the results
    const allJobs = [...manualJobs, ...scrapedJobs];

    res.status(200).json({
      success: true,
      data: allJobs,
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
    });
  }
};
