import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
    host: "smpt.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

export async function