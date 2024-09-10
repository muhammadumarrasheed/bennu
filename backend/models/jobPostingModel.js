// Model for job postings created by recruiters

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const jobPostingSchema = new Schema({
  title: { type: String, required: true },
  recruiterId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Refers to the recruiter posting the job
  recruiter: { type: String },
  age: { type: Number }, // Minimum age requirement
  season: { type: String }, // e.g., Summer, Winter, etc.
  eligibility: { type: String }, // Any specific requirements
  description: { type: String },
  mode: { type: String }, // e.g., Remote, Hybrid, In-person
  location: { type: String },
  address: { type: String },
  programFee: { type: String },
  isScraped: { type: Boolean, default: false }, // Flag if the job was scraped from another source
  status: { type: String, default: 'open' }, // Job status (open, closed, etc.)
  created_at: { type: Date, default: Date.now }
});

const JobPosting = mongoose.model('JobPosting', jobPostingSchema);
module.exports = JobPosting;