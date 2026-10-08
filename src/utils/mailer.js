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
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  // Explicitly forces IPv4 address resolution (bypasses Render IPv6 ENETUNREACH)
  lookup: (hostname, options, callback) => {
    dns.lookup(hostname, { family: 4 }, (err, address, family) => {
      callback(err, address, family);
    });
  },
  auth: {
    user: emailUser,
    pass: emailPass,
  },
  tls: {
    rejectUnauthorized: false,
    servername: "smtp.gmail.com",
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