// lib/twilio.js
import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendOTPViaTwilio = async (mobile) => {
  return client.verify.v2
    .services(process.env.TWILIO_VERIFY_SID)
    .verifications.create({
      to: mobile,
      channel: "sms",
    });
};

export const verifyOTPViaTwilio = async (mobile, code) => {
  try {
    const res = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verificationChecks.create({
        to: mobile,
        code,
      });

    return { valid: res.status === "approved", status: res.status };
  } catch (error) {
    // Error 20404: resource not found = expired, already used, or too many attempts
    if (error.code === 20404) {
      return {
        valid: false,
        status: "expired_or_used",
        message: "OTP has expired or was already used. Please request a new one.",
      };
    }
    throw error; // re-throw unexpected errors
  }
};