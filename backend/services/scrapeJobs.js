const puppeteer = require('puppeteer');
const ScrapedJob = require('../models/ScrapedJob'); // Use the new ScrapedJob model

async function scrapeJobs() {
  try {
    // Launch the browser
    const browser = await puppeteer.launch({
      headless: false,
      protocolTimeout: 99960000,
    });

    const page = await browser.newPage();
    await page.goto('https://www.standoutsearch.com/', {
      waitUntil: 'networkidle2',
    });

    // Delay function for waiting
    const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

    // Function to load all jobs by clicking "View More"
    async function loadAllJobs() {
      const startTime = Date.now();
      let loadMoreButton = await page.$('.chakra-button.css-1ttmns8');

      while (loadMoreButton && Date.now() - startTime < maxDuration) {
        await loadMoreButton.click();
        await delay(300); // Wait for jobs to load
        loadMoreButton = await page.$('.chakra-button.css-1ttmns8');
      }
    }

    const maxDuration = 120000; // 2 minutes max for loading all jobs
    // await loadAllJobs();

    // Scrape job details
    const jobs = await page.evaluate(async () => {
      const jobElements = document.querySelectorAll('.chakra-accordion__item');
      const jobsArray = [];

      const getTextContent = (label) => {
        const element = [...document.querySelectorAll('.chakra-stack p')].find(el => el.textContent.includes(label));
        return element ? element.nextElementSibling.innerText.trim() : '';
      };

      const getListContent = (label) => {
        const element = [...document.querySelectorAll('.chakra-stack p')].find(el => el.textContent.includes(label));
        return element ? [...element.nextElementSibling.querySelectorAll('li span')].map(el => el.textContent.trim()).join(', ') : '';
      };

      for (let element of jobElements) {
        const jobTitle = element.querySelector('.css-134zrag')?.innerText.trim();
        const company = element.querySelector('.css-14pw5qv')?.innerText.trim();
        const deadline = element.querySelector('.css-111tzkx')?.innerText.trim();

        const viewButton = element.querySelector('a.chakra-link');

        if (viewButton) {
          viewButton.click();
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const jobLink = document.querySelector('a.chakra-button')?.href || '';
          const applyNowLink = document.querySelector('a.chakra-link.chakra-button.css-x297hf')?.href || '';

          const age = getListContent('Age:');
          const season = getTextContent('Season:');
          const mode = getTextContent('Mode:');
          const location = getTextContent('Location:');
          const address = getTextContent('Address:');
          const programFee = getTextContent('Program Fee/Tuition:');
          const description = getTextContent('Description:');
          const requirements = getTextContent('Requirements:');

          const job = {
            jobTitle: jobTitle || '',
            company: company || '',
            deadline: deadline || '',
            jobLink: jobLink || '',
            applyNowLink: applyNowLink || '',
            age: age || '',
            season: season || '',
            mode: mode || '',
            location: location || '',
            address: address || '',
            programFee: programFee || '',
            description: description || '',
            requirements: requirements || '',
            imageLink: 'http://localhost:3000/static/media/logo.797f4cc11db5249cf424.png' // Hardcoded image link for scraped jobs
          };

          jobsArray.push(job);
        }
      }

      return jobsArray;
    });

    for (const job of jobs) {
      // Check if the job already exists based on title, company, and jobLink
      const existingJob = await ScrapedJob.findOne({
        title: job.jobTitle,
        company: job.company,
        jobLink: job.jobLink
      });

      if (!existingJob) {
        // Save the job if it's not a duplicate
        await ScrapedJob.create({
          title: job.jobTitle,
          company: job.company,
          age: job.age,
          season: job.season,
          eligibility: job.requirements,
          description: job.description,
          mode: job.mode,
          location: job.location,
          address: job.address,
          programFee: job.programFee,
          jobLink: job.jobLink,
          applyNowLink: job.applyNowLink,
          status: 'open',
          created_at: new Date(),
          imageLink: job.imageLink
        });

        console.log(`Job ${job.jobTitle} saved successfully!`);
      } else {
        console.log(`Duplicate job found: ${job.jobTitle}. Skipping...`);
      }
    }

    await browser.close();
  } catch (error) {
    console.error('Error scraping jobs:', error);
  }
}

module.exports = scrapeJobs;
