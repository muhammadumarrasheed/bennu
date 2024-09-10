// User model that unifies job seekers, recruiters, and admins

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Job Seeker-specific information
const jobSeekerSchema = new Schema({
  profilePic: { type: String }, // Link to profile picture
  name: { type: String, required: true },
  summary: { type: String }, // Short summary or bio
  skills: [{ type: String }], // List of skills
  experience: { type: String }, // Work experience details
  interests: [{ type: String }], // Array of interests
  hobbies: { type: String } // Hobbies and activities
});

// Recruiter-specific information
const recruiterSchema = new Schema({
  companyName: { type: String, required: true },
  companyDetails: { type: String },
  complianceStatus: { type: String },
  jobPostings: [{ type: Schema.Types.ObjectId, ref: 'JobPosting' }]
});

// Admin-specific information
const adminSchema = new Schema({
  permissions: [{ type: String }] // List of admin permissions
});

// Main User schema
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['jobSeeker', 'recruiter', 'admin'], required: true },
  personalInfo: {
    contactNumber: { type: String },
    address: { type: String }
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  jobSeekerInfo: jobSeekerSchema, // For job seekers
  recruiterInfo: recruiterSchema, // For recruiters
  adminInfo: adminSchema, // For admins
  messageSettings: {
    notificationsEnabled: { type: Boolean, default: true },
    autoArchiveDuration: { type: Number, default: 30 },
    blockList: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
