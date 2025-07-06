import express from 'express';
import { getJobs, scrapeJobsNow } from '../controllers/jobController.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/scrape', scrapeJobsNow);

export default router;