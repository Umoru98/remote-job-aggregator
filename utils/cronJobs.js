import cron from 'node-cron';
import Job from '../models/job.js';
import { scrapeJobs } from '../services/scraper.js';
import { sendJobNotifications, generateEmailTemplate } from '../services/emailService.js';

export const startCronJobs = () => {
  cron.schedule(process.env.CRON_SCHEDULE, async () => {
    console.log('Cron job running: Scraping jobs...');

    const scrapedJobs = await scrapeJobs();

    if (!scrapedJobs || scrapedJobs.length === 0) {
      console.log('No jobs scraped.');
      return;
    }

    const newJobs = [];
    const jobsBySource = {};

    for (const job of scrapedJobs) {
      const exists = await Job.findOne({ url: job.url });
      if (!exists) {
        const newJob = await Job.create(job);
        newJobs.push(newJob);

        if (!jobsBySource[newJob.source]) {
          jobsBySource[newJob.source] = [];
        }
        jobsBySource[newJob.source].push(newJob);
      }
    }

    if (newJobs.length > 0) {
      const emailBody = generateEmailTemplate(jobsBySource);
      await sendJobNotifications(emailBody);

      for (const job of newJobs) {
        job.notified = true;
        await job.save();
      }

      console.log(`Scraping complete. ${newJobs.length} new jobs added and notified.`);
    } else {
      console.log('No new jobs found.');
    }
  });
};
