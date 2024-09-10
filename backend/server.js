const express = require('express');
const connectDB = require('./config/database'); // Database connection
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const dotenv = require('dotenv');
const path = require('path');
const cron = require('node-cron');  // Import node-cron
const jobRoutes = require('./routes/jobRoutes');

// Import the scraping service
const scrapeJobs = require('./services/scrapeJobs');

// Load environment variables
dotenv.config();

// Initialize Express application
const app = express();

// Connect to MongoDB
connectDB();

// Middleware setup
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));
// scrapeJobs();
// Schedule scraping to run every 2 hours
cron.schedule('0 */2 * * *', () => {
  console.log('Running job scraping every 2 hours...');
  scrapeJobs();
});

// job routes

app.use('/api', jobRoutes); 


// Error handling for invalid routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong, please try again later',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
