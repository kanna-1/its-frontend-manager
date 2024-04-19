import nodemailer from "nodemailer";

const publicURL = process.env.PUBLIC_URL;
const appPassword = process.env.APP_PASSWORD;
const hostEmail = process.env.HOST_EMAIL;
const smtpHost = process.env.SMTP_HOST;

export const sendPasswordResetEmail = async (
  email: string,
  token: string
): Promise<unknown> => {
  let resetLink = "";
  if (process.env.NODE_ENV === "production") {
    resetLink = `${publicURL}/new-password?token=${token}`;
  } else {
    resetLink = `http://localhost:3000/new-password?token=${token}`;
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: 465,
    secure: true,
    tls: {
      rejectUnauthorized: false,
      ciphers: "DEFAULT@SECLEVEL=0",
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
    html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
  };

  return new Promise((resolve) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
      } else {
        console.log("Email sent: ", info.response);
        resolve(info.response);
      }
    });
  });
};
