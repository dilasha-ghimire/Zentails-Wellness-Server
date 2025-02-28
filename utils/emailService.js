const nodemailer = require("nodemailer");

// Setup the email transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Use your email service (Gmail, Outlook, SMTP, etc.)
  post: 587,
  secure: false,
  protocal: "smtp",
  auth: {
    user: "dilashaghimire18@gmail.com", // Your email address
    pass: "dwszzwsutacqxbnq", // Your email password or app password
  },
});

/**
 * Sends an email to the customer
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} text - Email text content
 * @param {string} html - HTML formatted email content
 */
const sendEmail = async (to, subject, text, html) => {
  try {
    await transporter.sendMail({
      from: `"Therapy Booking" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
