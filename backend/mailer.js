import nodemailer from "nodemailer";

export const createTransporter = (mode = "test") => {
    const isLive = mode === "live";

    const host = isLive ? process.env.SMTP_LIVE_HOST : process.env.SMTP_TEST_HOST;
    const port = isLive ? process.env.SMTP_LIVE_PORT : process.env.SMTP_TEST_PORT;
    const user = isLive ? process.env.SMTP_LIVE_USER : process.env.SMTP_TEST_USER;
    const pass = isLive ? process.env.SMTP_LIVE_PASS : process.env.SMTP_TEST_PASS;

    if (!host || !port || !user || !pass) {
        console.error("❌ SMTP ENV variables missing for mode:", mode);
        throw new Error("SMTP configuration missing");
    }

    console.log(`📧 Creating ${mode.toUpperCase()} transporter`);
    console.log(`Host: ${host} | Port: ${port} | User: ${user}`);

    const transporter = nodemailer.createTransport({
        host,
        port,
        secure: false, // true only if port 465
        auth: {
            user,
            pass,
        },
    });

    return transporter;
};
