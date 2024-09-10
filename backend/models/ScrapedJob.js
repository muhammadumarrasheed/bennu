const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scrapedJobSchema = new Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },  // Company that posted the job
  age: { type: String }, // Age requirement (since it's often a range)
  season: { type: String }, // Season like Summer, Winter, etc.
  eligibility: { type: String }, // Specific requirements
  description: { type: String },
  mode: { type: String }, // e.g., Remote, Hybrid, In-person
  location: { type: String },
  address: { type: String },
  programFee: { type: String },
  jobLink: { type: String },  // Link to the original job posting
  applyNowLink: { type: String },  // External apply link for the job
  imageLink: { type: String, default: 'http://localhost:3000/static/media/logo.797f4cc11db5249cf424.png' },  // Hardcoded image link for scraped jobs
  isScraped: { type: Boolean, default: true },  // Always true for scraped jobs
  status: { type: String, default: 'open' },  // Status of the job
  created_at: { type: Date, default: Date.now }  // Timestamp
});

const ScrapedJob = mongoose.model('ScrapedJob', scrapedJobSchema);

module.exports = ScrapedJob;
