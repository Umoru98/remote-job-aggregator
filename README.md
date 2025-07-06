# 🚀 Remote Job Aggregator

## Table of Contents
- [About](#about)
- [Features](#features)
- [Supported Job Boards](#supported-job-boards)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
  - [Starting the API Server](#starting-the-api-server)
  - [Triggering Scrapes Manually](#triggering-scrapes-manually)
  - [Scheduled Scraping (Cron Jobs)](#scheduled-scraping-cron-jobs)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Troubleshooting & Common Issues](#troubleshooting--common-issues)
  - [Cloudflare/Anti-Bot Detections](#cloudflareanti-bot-detections)
  - [Scraper Breakage (Selector Changes)](#scraper-breakage-selector-changes)
  - [Email Sending Issues](#email-sending-issues)
  - [High Resource Usage](#high-resource-usage)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 📄 About

**Remote Job Aggregator** is a robust **Node.js-based** web scraping and job notification system that automates the discovery of remote job postings. It uses **Puppeteer** for headless browser automation and **Mongoose** for storing jobs in a MongoDB database.

The system:
- Prevents duplicate entries.
- Sends automated email notifications using **Nodemailer**.
- Exposes an **Express.js API** for fetching stored jobs and manually triggering scrapes.

---

## ✨ Features

- **Multi-Source Scraping:** Pulls jobs from top remote job boards.
- **Persistent Storage:** Saves jobs in MongoDB with schema validation.
- **Duplicate Prevention:** Ensures only unique jobs are saved.
- **Automated Notifications:** Sends grouped email alerts for new jobs.
- **API Endpoints:**
  - `GET /api/jobs` – Fetch all jobs.
  - `GET /api/jobs/scrape` – Trigger a manual scrape.
- **Scheduled Automation:** Cron-based periodic scraping and notifications.
- **Anti-Bot Evasion:** Supports `puppeteer-extra` with stealth plugins.

---

## 🌐 Supported Job Boards

- **Indeed.com**
- **WeWorkRemotely.com**
- **RemoteOK.com**
- **Remote.co**

---

## ⚙️ Prerequisites

- **Node.js v18.x** or later
- **npm v8.x** or **Yarn**
- **MongoDB** (local or MongoDB Atlas)
- **Gmail account** (or another SMTP provider)

---

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Umoru98/remote-job-aggregator.git
   cd remote-job-aggregator
   ```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
```

3. **Chromium Installation:**
Puppeteer automatically downloads Chromium. If issues occur, ensure a working Chromium/Chrome is available.

---

## ⚙️ Configuration
Create a `.env` file in the root directory:
```dotenv
# Server Port
PORT=5000

# MongoDB Connection
MONGO_URI=mongodb+srv://[YOUR_USERNAME]:[YOUR_PASSWORD]@cluster0.mongodb.net/?retryWrites=true&w=majority

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password
NOTIFY_EMAIL=recipient-email@example.com

# Cron Job Schedule (Recommended: Every 6 hours)
CRON_SCHEDULE=0 */6 * * *

# Proxy (Optional for sites with aggressive anti-bot detection)
# PROXY_URL=http://username:password@proxy.example.com:port
```

---

## 🚀 Usage
### Starting the API Server
```bash
npm start
# or
node server.js
```
The server will run on the `PORT` defined in your `.env` file (default: `5000`).

### Triggering Scrapes Manually
Access this endpoint in your browser or via Postman:
```http
GET http://localhost:5000/api/jobs/scrape
```

### Scheduled Scraping (Cron Jobs)
The scraper runs automatically based on the `CRON_SCHEDULE` in your `.env` file.

### Cron Schedule Examples:
`*/3 * * * *` – Every 3 minutes (Not Recommended)

`0 */6 * * *` – Every 6 hours

`0 9 * * *` – Every day at 9:00 AM

**Note**: Use longer intervals to reduce the risk of IP bans, especially on sites like Indeed.

---

## Database Schema
Jobs are stored with the following fields:

- `title` – Job title
- `company` – Company name
- `url` – Job link (unique)
- `source` – Job board source
- `dateScraped` – Timestamp

---

## Troubleshooting & Common Issues

### Cloudflare/Anti-Bot Detections
#### Symptoms:

  - Timeout errors

  - "Checking your browser..." messages

  - CAPTCHA challenges

#### Solutions:

  - Reduce scraping frequency.

  - Use paid residential proxies.

  - Keep Puppeteer and user-agent strings updated.

### Scraper Breakage (Selector Changes)
#### Symptoms:

  - Zero jobs scraped

  - Incorrect job titles or URLs

#### Solutions:

  - Set headless: false in puppeteerHelper.js to debug.

  - Inspect the site’s new DOM structure.

  - Update the selectors in the respective scraper file.

### Email Sending Issues
#### Symptoms:

  - Email errors in console

  - No emails received

#### Solutions:

  - Ensure correct email credentials in `.env`.

  - Use an App Password for Gmail (not your account password).

  - Verify the recipient email address.

### High Resource Usage
#### Symptoms:

  - Puppeteer processes hanging

  - High CPU or memory usage

#### Solutions:

  - Use proper page.close() and browser.close() calls.

  - Limit concurrent scrapes.

  - Consider headless browsers in Docker for better control.

---

## Future Enhancements
  - Add more job boards.

  - Keyword and company-based filtering.

  - Slack/Discord webhook support.

  - API authentication (API keys or JWT).

  - Docker containerization.

  - Advanced duplicate detection across multiple sources.

  - Detailed job page scraping.

---

## Contributing
Contributions are welcome! Feel free to:

  - Fork this repository

  - Create a new branch

  - Submit a pull request

---

## License
This project is licensed under the MIT License.

---

## Contact
For inquiries, contact: **umoruvictor98@gmail.com**