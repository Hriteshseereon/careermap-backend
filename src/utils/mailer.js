import nodemailer from "nodemailer";

const emailUser = (process.env.EMAIL_USER || "").trim();
const emailPass = (process.env.EMAIL_PASS || "").trim().replace(/\s+/g, "");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // SSL direct connection (most reliable on Render/Cloud)
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  auth: {
    user: emailUser,
    pass: emailPass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify connection configuration on startup
if (emailUser && emailPass) {
  transporter.verify((error) => {
    if (error) {
      console.error("❌ SMTP Connection Error (Render/Server):", error.message);
    } else {
      console.log(`✅ SMTP Mailer connected successfully for: ${emailUser}`);
    }
  });
} else {
  console.warn("⚠️ Warning: EMAIL_USER or EMAIL_PASS environment variables are not set!");
}

export default transporter;