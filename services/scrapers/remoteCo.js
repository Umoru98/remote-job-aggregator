import { launchBrowser, newPageWithHeaders } from '../puppeteerHelper.js';

export const scrapeRemoteCo = async () => {
  const browser = await launchBrowser();
  const page = await newPageWithHeaders(browser);

  try {
    await page.goto('https://remote.co/remote-jobs/', { waitUntil: 'domcontentloaded' });

    const jobs = await page.evaluate(() => {
      const jobElements = document.querySelectorAll('a[class*="yUlEv"]');

      return Array.from(jobElements).map(el => ({
        title: el.innerText.trim(),
        url: 'https://remote.co' + el.getAttribute('href'),
        source: 'Remote.co',
      }));
    });

    console.log(`Scraped ${jobs.length} jobs from Remote.co.`);
    return jobs.slice(0, 10); // Limit to 10 jobs
  } catch (error) {
    console.error('Error scraping Remote.co:', error.message);
    return [];
  } finally {
    await browser.close();
  }
};
