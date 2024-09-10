// Model for tracking job applications from job seekers

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
  jobId: { type: Schema.Types.ObjectId, ref: 'JobPosting', required: true }, // Refers to the applied job
  jobSeekerId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Refers to the job seeker
  status: { type: String, default: 'submitted' }, // Current application status (submitted, reviewed, etc.)
  submitted_at: { type: Date, default: Date.now }
});

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;
