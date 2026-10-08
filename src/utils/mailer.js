import dns from "dns";
import nodemailer from "nodemailer";

// Render and cloud containers do not support outbound IPv6. Force IPv4 first.
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}

const emailUser = (process.env.EMAIL_USER || "").trim();
const emailPass = (process.env.EMAIL_PASS || "").trim().replace(/\s+/g, "");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // SSL direct connection
  family: 4,    // Force IPv4 socket (prevents ENETUNREACH on Render's IPv6-disabled network)
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