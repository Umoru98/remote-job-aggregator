import { scrapeRemoteOK } from './scrapers/remoteOK.js';
import { scrapeWeWorkRemotely } from './scrapers/weWorkRemotely.js';
import { scrapeRemoteCo } from './scrapers/remoteCo.js';
import { scrapeIndeed } from './scrapers/indeed.js';

export const scrapeJobs = async () => {
    console.log('Cron job running: Scraping jobs...');
    const allJobs = [];

    try {
        const remoteOKJobs = await scrapeRemoteOK();
        console.log(`Scraped ${remoteOKJobs.length} jobs from RemoteOK.`);
        allJobs.push(...remoteOKJobs);
    } catch (error) {
        console.error('Error scraping RemoteOK:', error.message);
    }

    try {
        const weWorkRemotelyJobs = await scrapeWeWorkRemotely();
        console.log(`Scraped ${weWorkRemotelyJobs.length} jobs from WeWorkRemotely.`);
        allJobs.push(...weWorkRemotelyJobs);
    } catch (error) {
        console.error('Error scraping WeWorkRemotely:', error.message);
    }

    try {
        const remoteCoJobs = await scrapeRemoteCo();
        console.log(`Scraped ${remoteCoJobs.length} jobs from Remote.co.`);
        allJobs.push(...remoteCoJobs);
    } catch (error) {
        console.error('Error scraping Remote.co:', error.message);
    }

    try {
        const indeedJobs = await scrapeIndeed();
        console.log(`Scraped ${indeedJobs.length} jobs from Indeed.`);
        allJobs.push(...indeedJobs);
    } catch (error) {
        console.error('Error scraping Indeed:', error.message);
    }

    console.log('Scraping completed.');
    return allJobs;
};
