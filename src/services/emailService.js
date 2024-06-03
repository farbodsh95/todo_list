const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const sendTaskDoneEmail = async (to, taskDescription) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject: "Task Completed",
    text: `Your task "${taskDescription}" is marked as done.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { sendTaskDoneEmail };
