import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

export const scrapeIndeed = async () => {
    // Consider 'new' headless mode for better evasion
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();

    // Set a common desktop user agent explicitly (StealthPlugin does some of this, but it doesn't hurt)
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1366, height: 768 }); // Set a common viewport size

    // Helper for random delays
    const delay = ms => new Promise(res => setTimeout(res, ms));

    try {
        const searchURL = 'https://www.indeed.com/jobs?q=remote&l=';
        // Use 'networkidle2' for better chance of loading all dynamic content
        await page.goto(searchURL, { waitUntil: 'networkidle2', timeout: 120000 });

        // Add a random delay after initial navigation
        await delay(2000 + Math.random() * 3000);

        // Check if a Cloudflare challenge page is present (you might need to adjust selectors based on what Cloudflare shows)
        const cloudflareChallenge = await page.$('#challenge-form, #cf-wrapper');
        if (cloudflareChallenge) {
            console.warn('Cloudflare challenge detected. Attempting to bypass...');
            // You might need more sophisticated logic here, e.g.,
            // await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 });
            // or if it's a "Press and Hold", it might resolve by itself after a few seconds.
            // If it's a CAPTCHA, you'd need a CAPTCHA-solving service integrated.
            // For now, let's just wait and see if it resolves.
            await delay(10000); // Give it up to 10 seconds to resolve
            const resolvedChallenge = await page.$('#challenge-form, #cf-wrapper');
            if (resolvedChallenge) {
                 console.error('Cloudflare challenge not bypassed automatically. Exiting Indeed scrape.');
                 await browser.close();
                 return [];
            }
        }

        // Wait for job title elements, potentially with a longer timeout
        await page.waitForSelector('a.jcs-JobTitle', { timeout: 45000 }); 

        // Add another random delay before scraping
        await delay(1000 + Math.random() * 2000);

        const jobs = await page.evaluate(() => {
            const jobElements = document.querySelectorAll('a.jcs-JobTitle');

            return Array.from(jobElements).map(el => {
                const titleElement = el.querySelector('span'); // This might be correct for the visible title
                const companyElement = el.closest('.job_seen_beacon')?.querySelector('.companyName'); // Common selector for company
                const locationElement = el.closest('.job_seen_beacon')?.querySelector('.companyLocation'); // Common selector for location

                return {
                    title: titleElement ? titleElement.innerText.trim() : 'New job from Indeed',
                    url: 'https://www.indeed.com' + el.getAttribute('href'),
                    source: 'Indeed',
                    company: companyElement ? companyElement.innerText.trim() : 'N/A',
                    location: locationElement ? locationElement.innerText.trim() : 'N/A',
                };
            });
        });

        console.log(`Scraped ${jobs.length} jobs from Indeed.`);
        return jobs.slice(0, 10);
    } catch (error) {
        console.error('Error scraping Indeed:', error.message);
        // You might want to log the page content or take a screenshot here for debugging
        // await page.screenshot({ path: 'indeed_error.png' });
        // await page.content().then(html => console.log(html));
        return [];
    } finally {
        await browser.close();
    }
};