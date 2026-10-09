import dns from "dns";
import nodemailer from "nodemailer";

if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}

const emailUser = (process.env.EMAIL_USER || "").trim();
const emailPass = (process.env.EMAIL_PASS || "").trim().replace(/\s+/g, "");
const resendApiKey = (process.env.RESEND_API_KEY || "").trim();

const nodemailerTransporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
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

/**
 * Sends email via Resend HTTPS REST API (Port 443 - 100% works on Render Free Tier)
 */
export const sendMailViaHttp = async ({ from, to, subject, html }) => {
  const verifiedFrom = process.env.EMAIL_FROM || "CareerMap <onboarding@resend.dev>";
  
  // If 'from' is a gmail address or not verified, use Resend's default sender so it never errors
  let sender = from;
  if (!sender || sender.includes("@gmail.com") || !process.env.EMAIL_FROM) {
    sender = verifiedFrom;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.RESEND_API_KEY?.trim()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: sender,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    console.error("❌ Resend API Error:", data);
    throw new Error(data.message || JSON.stringify(data));
  }
  return data;
};

/**
 * Unified Mailer Transporter:
 * If RESEND_API_KEY is present -> Uses HTTPS API (Render Free Tier compatible)
 * Otherwise -> Uses standard Nodemailer SMTP
 */
const transporter = {
  sendMail: async (options) => {
    if (process.env.RESEND_API_KEY) {
      return sendMailViaHttp(options);
    }
    return nodemailerTransporter.sendMail(options);
  },
};

// Startup diagnostic check
if (process.env.RESEND_API_KEY) {
  console.log("✅ Mailer configured using HTTPS REST API (Resend) - Render compatible!");
} else if (emailUser && emailPass) {
  nodemailerTransporter.verify((error) => {
    if (error) {
      console.warn("⚠️ SMTP Notice: Render Free Tier blocks outbound SMTP (ports 465/587). Error:", error.message);
      console.warn("👉 Recommendation: Add RESEND_API_KEY in Render Environment Variables to send emails over HTTPS (port 443) for free!");
    } else {
      console.log(`✅ SMTP Mailer connected for: ${emailUser}`);
    }
  });
} else {
  console.warn("⚠️ Warning: Neither RESEND_API_KEY nor (EMAIL_USER & EMAIL_PASS) is set!");
}

export default transporter;