const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

async function sendReminderEmail({ to, subject, html }) {
  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    html,
  });

  return info;
}


module.exports = { sendReminderEmail };