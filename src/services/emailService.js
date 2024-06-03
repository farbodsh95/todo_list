// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: process.env.MAILTRAP_HOST,
//   port: process.env.MAILTRAP_PORT,
//   auth: {
//     user: process.env.MAILTRAP_USER,
//     pass: process.env.MAILTRAP_PASS,
//   },
// });

// const sendTaskDoneEmail = async (to, taskDescription) => {
//   const mailOptions = {
//     from: "your-email@example.com", // sender address
//     to, // list of receivers
//     subject: "Task Completed", // Subject line
//     text: `Your task "${taskDescription}" is marked as done.`, // plain text body
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log(`Email sent to ${to}`);
//   } catch (error) {
//     console.error("Error sending email:", error);
//   }
// };

// module.exports = { sendTaskDoneEmail };

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
    from: process.env.GMAIL_USER, // sender address
    to, // list of receivers
    subject: "Task Completed", // Subject line
    text: `Your task "${taskDescription}" is marked as done.`, // plain text body
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { sendTaskDoneEmail };
