import { launchBrowser, newPageWithHeaders } from '../puppeteerHelper.js';

export const scrapeRemoteOK = async () => {
    const browser = await launchBrowser();
    const page = await newPageWithHeaders(browser);

    try {

        await page.goto('https://remoteok.com/', { waitUntil: 'networkidle2', timeout: 120000 });

        const jobs = await page.evaluate(() => {
            // Looks for <tr> elements with a 'data-id' attribute within the main jobs table tbody
            const jobRows = document.querySelectorAll('table#jobsboard tbody tr[data-id]');

            return Array.from(jobRows).map(job => {
                const titleElement = job.querySelector('h2[itemprop="title"]');
                const linkElement = job.querySelector('a.preventLink');
                const companyElement = job.querySelector('.companyLink'); // Selector for company name, often useful

                return {
                    title: titleElement ? titleElement.innerText.trim() : 'New Job from RemoteOK',
                    url: linkElement ? 'https://remoteok.com' + linkElement.getAttribute('href') : 'No link',
                    source: 'RemoteOK',
                    company: companyElement ? companyElement.innerText.trim() : 'N/A', // Include company name
                };
            }).filter(job => job.url !== 'No link'); // Filter out entries with no link
        });

        console.log(`Scraped ${jobs.length} jobs from RemoteOK.`);
        return jobs.slice(0, 10); // Limit to 10 jobs
    } catch (error) {
        console.error('Error scraping RemoteOK:', error.message);
        return [];
    } finally {
        await browser.close();
    }
};