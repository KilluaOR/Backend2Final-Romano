import nodemailer from "nodemailer";

//Transporte con protocolo SMPT
const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const mailingService = {
  sendMail: async ({ to, subject, html }) => {
    return await transport.sendMail({
      from: `Orne Store <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });
  },
};
