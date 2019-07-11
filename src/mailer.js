import nodemailer from "nodemailer";

const from = "'Bookworm' <noreply@bookworm.in>";

function setup() {
  console.log("transport called");
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
}
export function sendConfirmationEmail(user) {
  const transport = setup();
  console.log("Writing Email");
  const email = {
    from,
    to: user.email,
    subject: "Welcome to bookworm",
    text: `
  Welcome to bookworm. Please confirm your email.
  ${user.generateConfirmationUrl()}
  `
  };
  transport.sendMail(email);
}
