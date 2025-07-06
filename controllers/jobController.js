import Job from '../models/job.js';
import { scrapeJobs } from '../services/scraper.js';

export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs' });
  }
};

export const scrapeJobsNow = async (req, res) => {
  try {
    const scrapedJobs = await scrapeJobs();
    const newJobs = [];

    for (const job of scrapedJobs) {
      const exists = await Job.findOne({ url: job.url });
      if (!exists) {
        const newJob = await Job.create(job);
        newJobs.push(newJob);
      }
    }

    res.json({ message: `Scraped successfully. ${newJobs.length} new jobs added.` });
  } catch (error) {
    res.status(500).json({ message: 'Error scraping jobs' });
  }
};
