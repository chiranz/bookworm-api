import nodemailer from "nodemailer";

const from = "'Bookworm' <noreply@bookworm.in>";

function setup() {
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

export function sendResetPasswordEmail(user) {
  const transport = setup();
  const email = {
    from,
    to: user.email,
    subject: "Password reset email.",
    text: `
  Please follow this link to reset your password!
  ${user.generateResetPasswordLink()}
  `
  };
  console.log("send reset password email");
  transport.sendMail(email);
}
