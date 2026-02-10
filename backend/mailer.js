import nodemailer from "nodemailer";

export const createTransporter = (mode = "test") => {
    const isLive = mode === "live";

    const transporter = nodemailer.createTransport({
        host: isLive ? process.env.SMTP_LIVE_HOST : process.env.SMTP_TEST_HOST,
        port: isLive ? process.env.SMTP_LIVE_PORT : process.env.SMTP_TEST_PORT,
        secure: false,
        auth: {
            user: isLive ? process.env.SMTP_LIVE_USER : process.env.SMTP_TEST_USER,
            pass: isLive ? process.env.SMTP_LIVE_PASS : process.env.SMTP_TEST_PASS,
        },
    });

    return transporter;
};
