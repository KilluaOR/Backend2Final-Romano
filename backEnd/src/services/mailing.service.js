import nodemailer from "nodemailer";

console.log("Configurando mail con:", process.env.MAIL_USER);
//Transporte con protocolo SMPT
export const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: `orneroma@gmail.com`,
    pass: `amxj ajya xtnc aaih`,
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
