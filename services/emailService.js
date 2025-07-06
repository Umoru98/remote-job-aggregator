import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const generateEmailTemplate = (jobsBySource) => {
  let emailContent = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #2c3e50;">New Jobs Found</h2>
      <p>Here are the latest remote job postings from your sources:</p>
  `;

  for (const [source, jobs] of Object.entries(jobsBySource)) {
    emailContent += `
      <h3 style="color: #27ae60; margin-top: 20px;">${source}</h3>
      <ul style="padding-left: 20px;">`;

    jobs.forEach(job => {
      emailContent += `
        <li style="margin-bottom: 10px;">
          <a href="${job.url}" target="_blank" style="color: #2980b9; text-decoration: none; font-size: 16px;">
            ${job.title}
          </a>
        </li>`;
    });

    emailContent += `</ul>`;
  }

  emailContent += `
      <p style="margin-top: 30px; color: #95a5a6; font-size: 12px;">
        This is an automated job alert from your web scraper.
      </p>
    </div>
  `;

  return emailContent;
};

export const sendJobNotifications = async (emailBody) => {
  if (!emailBody) return;

  const mailOptions = {
    from: `"Job Notifier" <${process.env.EMAIL_USER}>`,
    to: process.env.NOTIFY_EMAIL,
    subject: 'New Job Postings Available!',
    html: emailBody,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Notification email sent');
  } catch (error) {
    console.error('Error sending email:', error.message);
  }
};
