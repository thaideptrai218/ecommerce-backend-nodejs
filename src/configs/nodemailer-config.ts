import nodemailer from "nodemailer";

export const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: process.env.EMAIL_NAME || "welterial218@gmail.com",
        pass: process.env.EMAIL_APP_PASSWORD || "nfpy focz duce bahd",
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    rateLimit: 10,
    debug: true,
});
