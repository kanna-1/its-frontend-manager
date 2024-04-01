const publicURL = process.env.PUBLIC_URL;
const appPassword = process.env.APP_PASSWORD;
const hostEmail = process.env.HOST_EMAIL;

export const sendPasswordResetEmail = async (
    email: string,
    token: string,
  ) => {

  let resetLink = ""
  if (process.env.NODE_ENV === "production"){
    resetLink = `${publicURL}/new-password?token=${token}`
  } else {
    resetLink = `http://localhost:3000/new-password?token=${token}`
  }
  const nodemailer = require("nodemailer");

  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 587,
    secure: false,
    tls: {
      rejectUnauthorized: false,
      ciphers: 'DEFAULT@SECLEVEL=0'
    },
    auth: {
      user: hostEmail,
      pass: appPassword,
    },
  });

  const mailOptions = {
    from: hostEmail,
    to: email,
    subject: "Password reset link",
    html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`
  };


  await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions);
  });

};