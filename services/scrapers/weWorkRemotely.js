import { launchBrowser, newPageWithHeaders } from '../puppeteerHelper.js';

export const scrapeWeWorkRemotely = async () => {
    const url = 'https://weworkremotely.com/remote-jobs';
    const jobs = [];

    const browser = await launchBrowser();
    const page = await newPageWithHeaders(browser);

    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 120000 }); 

        const jobListings = await page.$$eval('.jobs > article > ul > li:not(.view-all)', (items) => {
            return items.map((item) => {
                const linkElement = item.querySelector('a');
                const jobTitleElement = item.querySelector('h4.new-listing__header__title');
                const companyElement = item.querySelector('.company'); // Assuming this selector is still correct for company

                return {
                    // Use the newly found title element, with a fallback
                    title: jobTitleElement?.innerText.trim() || 'No Title Found',
                    url: linkElement ? `https://weworkremotely.com${linkElement.getAttribute('href')}` : 'No link',
                    source: 'WeWorkRemotely',
                    company: companyElement?.innerText.trim() || 'N/A', 
                };
            });
        });

        jobs.push(...jobListings);

    } catch (error) {
        console.error('Error scraping WeWorkRemotely:', error.message);
    } finally {
        await browser.close();
    }

    console.log(`Scraped ${jobs.length} jobs from WeWorkRemotely.`);
    return jobs.slice(0, 10); // Limit to 10 jobs
};