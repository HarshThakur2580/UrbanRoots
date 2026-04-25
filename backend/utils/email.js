const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Use Gmail SMTP with App Password
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,  // Gmail address
      pass: process.env.EMAIL_PASSWORD   // Gmail App Password (no spaces)
    }
  });

  const mailOptions = {
    from: `UrbanRoots 🌿 <${process.env.EMAIL_USERNAME}>`,
    to: options.email,
    subject: options.subject,
    html: options.html || `<p>${options.message.replace(/\n/g, '<br>')}</p>`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
